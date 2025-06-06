// app/api/stripe/webhook/route.js
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { connectToDatabase } from "@/server/db"
import { createPayment, findPaymentByStripeId, updatePayment } from "@/server/models/Payment"
import { createSubscription, findSubscriptionByStripeId, updateSubscriptionByStripeId } from "@/server/models/Subscription"
import { updateUser, findUserById } from "@/server/models/user"
import { ObjectId } from "mongodb"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    // Connect to database
    await connectToDatabase()

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const { userId, audioId } = session.metadata || {}

        if (!userId) {
          console.error("Missing userId in session metadata")
          return NextResponse.json({ error: "Missing userId" }, { status: 400 })
        }

        const userObjectId = new ObjectId(userId)

        if (session.mode === "payment") {
          // Handle one-time payment
          await createPayment({
            userId: userObjectId,
            stripePaymentId: session.payment_intent,
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency,
            status: "succeeded",
            type: "one-time",
            metadata: session.metadata || {},
            audioId: audioId ? new ObjectId(audioId) : undefined,
          })

          // Update user's purchased audios if audioId exists
          if (audioId) {
            await updateUser(userObjectId, {
              $addToSet: { purchasedAudios: new ObjectId(audioId) },
            })
          }
        } else if (session.mode === "subscription") {
          // Handle subscription payment
          const subscription = await stripe.subscriptions.retrieve(session.subscription)

          await createSubscription({
            userId: userObjectId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            metadata: session.metadata || {},
          })

          // Update user's subscription status
          await updateUser(userObjectId, {
            hasActiveSubscription: true,
            stripeCustomerId: subscription.customer,
          })
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object

        if (invoice.subscription) {
          // Find the user ID from the subscription
          const subscription = await findSubscriptionByStripeId(invoice.subscription)
          
          if (subscription) {
            // Record the payment for the subscription
            await createPayment({
              userId: subscription.userId,
              stripePaymentId: invoice.payment_intent,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency,
              status: "succeeded",
              type: "subscription",
              metadata: invoice.metadata || {},
            })
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object

        await updateSubscriptionByStripeId(subscription.id, {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          ...(subscription.canceled_at && { canceledAt: new Date(subscription.canceled_at * 1000) }),
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object

        const existingSubscription = await findSubscriptionByStripeId(subscription.id)
        
        if (existingSubscription) {
          await updateSubscriptionByStripeId(subscription.id, {
            status: "canceled",
            canceledAt: new Date(),
          })

          // Update user's subscription status
          await updateUser(existingSubscription.userId, {
            hasActiveSubscription: false,
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}