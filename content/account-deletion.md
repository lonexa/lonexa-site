# Deleting your data, or your Steady Increment account

**Last updated: 30 August 2026**

Steady Increment, by Lonexa LLC. You can delete your data at any time, and you do
not need to ask us to do it. There are two separate things you might want, and
this page covers both:

- **Delete some or all of your data and keep your account** — the next section.
- **Delete your account and everything with it** — the section after that.

Neither needs our involvement, and neither is a request queue.

<!-- No in-page anchors: build.mjs emits headings without id attributes, so
     "#deleting-your-account" would be a dead link on a page Google reads as a
     compliance document. Plain pointers instead. -->


---

## Deleting your data without deleting your account

You do not have to close your account to get rid of what is in it. Two options
live in the app, both under **Profile → Settings → Data**, and **both remove the
data from our server as well as from your phone**.

### Clear workout history

**Profile → Settings → Data → Clear workout history.**

Removes every workout, every set, every cardio session and every readiness
check-in — from this device *and* from our server.

**Keeps:** your plans, your gyms and their equipment, your custom exercises, your
body measurements, your goals, your settings, your progress photos, and your
account.

### Reset everything

**Profile → Settings → Data → Reset everything.**

Removes everything the app holds about you except the account itself: workouts,
sets, cardio, plans, gyms and their equipment and increments, machine settings,
exercise preferences, custom exercises, readiness check-ins, body measurements,
goals, app settings, any usage counts you had switched on, your progress photos,
and the local record of anything you imported. Again, from this device **and**
from our server.

**Keeps:** your account and sign-in details, so you can carry on using the app
with a clean slate. The exercise library is restored to the one the app ships
with.

### Two things worth knowing

**The server is cleared first, and if that fails nothing is deleted.** A reset
that only cleared your phone would be worse than none at all: the next sync would
pull the server copy straight back and you would watch the data you deleted
reappear. So we delete from the server while your phone still holds everything,
and if that cannot be done — no signal, for instance — we stop and tell you,
having changed nothing.

**Neither of these deletes your account.** If that is what you want, see below.
And if you would rather keep a copy first, **Profile → Export your data** writes
everything you have logged as CSV and JSON before you delete any of it.

---

## Deleting your account

## The short version

| | |
|---|---|
| **What deletes your account** | *Account and sync* → **Delete my account**, inside the app |
| **How long it takes** | Immediately. It is not a request queue |
| **What is removed** | Your account, and everything we hold on our server |
| **What is kept** | The training log on your own phone, unless you erase it too |
| **Can it be undone** | No |

---

## Deleting from inside the app

1. Open **Profile → Account and sync**.
2. Scroll to **Delete your account**.
3. Tap **Delete my account** and confirm.

Your account is removed straight away and you are signed out.

## If you no longer have the app

Email **support@lonexa.ai** from the address your account uses, and ask us to
delete it. We will confirm by replying to that address, and we complete these
within **30 days** — in practice, much sooner.

We can only act on a request from the account's own email address. That is not
bureaucracy: acting on a request from anyone else would let a stranger delete
somebody's training history.

---

## What is deleted

Everything we hold on our server that belongs to your account:

- Your account itself, and your sign-in details
- Every workout, set, cardio session, plan, gym, exercise preference, readiness
  check-in, body metric and setting that had been synced
- Any goals you had set
- Your partner link, if you were using couple mode. Your partner keeps their own
  training; they simply stop being linked to you
- Any usage counts, if you had switched that option on

This is a real deletion, not a flag. Every one of those records is removed by
the database as a direct consequence of the account being removed, so there is
no list for us to forget to include. We have an automated check that fails if
any table is ever added that would not be caught by it.

## What is kept, and why

**The training log on your own phone.** Steady Increment stores everything
locally first — that is why it works in a gym with no signal — and your device's
copy is very often the only complete copy that exists. Deleting your account
signs you out; it does not reach into your phone and erase your training
history.

If you want that gone too, use **Settings → Reset everything** inside the app,
or simply uninstall it. Both are entirely under your control and neither needs
us.

**Crash reports**, if the app had crashed. These are held by our crash-reporting
provider, Sentry, for up to **90 days** and then deleted automatically. They
contain the error and the app version. They carry no account identifier and no
IP address, so once your account is gone there is nothing left connecting them
to you — which also means we cannot pick yours out to delete individually.

**The cost of AI requests, with your name taken off.** We keep a running record
of what the AI features cost us — the kind of request, the model, the number of
tokens and the price. When your account is deleted, **the account reference on
those rows is removed** and what is left cannot be linked back to you or to
anybody else. We keep them because that ledger is how we reconcile against our
AI provider's invoice; a gap in it is money we cannot account for. The rows hold
no training data, no text you wrote and no question you asked — only what a
request cost.

**Records we are required to keep.** If you had a paid subscription, the record
of that transaction is held by Google Play, not by us, and both of us are
required to keep billing records for tax purposes. Cancelling and refunds are
handled through Google Play.

---

## Anything sent to the AI

Steady Increment's AI features send a small set of training numbers to
Anthropic, our AI provider, to answer a question you asked. Those requests are
not used to train any model and are not retained by them beyond the processing
of the request. There is no separate AI account to delete.

---

## Questions

**support@lonexa.ai**

Lonexa LLC
