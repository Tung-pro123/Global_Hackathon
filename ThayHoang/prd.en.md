# PRD: Balcony Corner

## 1. Problem Statement

City renters often buy a few potted plants for their balcony, only to watch them slowly die. The issue isn't that they're lazy — it's that every plant species needs a different care rhythm, and all they get when they buy it is a species name tag on the pot. A name tag doesn't tell anyone whether today is a watering day, so the grower has to guess, guess wrong, and lose the plant. This is worth solving because every dead pot is one more time someone concludes they simply can't grow plants — and the next time, they don't buy another one.

## 2. Target Audience

Young people renting rooms or small apartments in the city, with a balcony or a sunlit window, who have bought plants before and have killed plants before. They want greenery at home but don't want caring for it to turn into a subject they have to study.

## 3. User Stories & Scenarios

[Assumption] Someone buys a second potted plant after the first one died. They bring it home, place it on the balcony, and water it diligently during the first week. By the second week, work gets busy and the watering schedule fades into vague memory. The plant starts dropping leaves, and the grower isn't sure whether it's underwatered or overwatered, so they respond by watering more — and the plant dies faster. With a care card planted right in the pot, the question "should I water today?" gets answered on the spot, through a visible signal on the pot itself, instead of relying on memory.

## 4. Proposed Solution

The core of the solution is a set of plant-care cards planted directly in the pot, one per species, stating the watering rhythm and the visible signs of an underwatered versus an overwatered plant, written in language for someone who has never grown a plant before. The team initially proposed several device-leaning directions — a soil moisture sensor that sends notifications to a phone, a watering-reminder app, a self-watering pot with a hidden reservoir, and a monthly plant-subscription model. After reconsidering from the renter's point of view, the team identified the key insight: what these users lack isn't a reminder but the ability to read the condition of the plant standing in front of them. A reminder still forces people to guess; a visible signal doesn't. So the device and app directions were deprioritized, and the pot-side care card was chosen as the focus because it addresses the root cause at the lowest cost and requires no electricity.

## 5. Key Features

### 5.1 Plant-Care Card Planted in the Pot

- **What it is:** A hard, moisture-resistant card planted into the soil of each pot, stating that species' watering rhythm and the visible signs of an underwatered or overwatered plant.
- **Why:** Answers "should I water today?" right where the grower is standing, with no electricity, no need to remember, and no need to open a phone.
- **Priority:** P0

### 5.2 Moisture Sensor with Notifications

- **What it is:** A sensor probe placed in the soil that measures moisture and sends a phone notification when the soil is dry.
- **Why:** More accurate than the eye, but requires a battery and one probe per pot, so cost scales with the number of plants.
- **Priority:** P1

### 5.3 Watering-Reminder App

- **What it is:** A phone app that keeps a watering schedule for each pot and pushes notifications to the user.
- **Why:** The team assessed that a reminder doesn't solve the underlying problem of the grower still having to guess the plant's condition, so this was deprioritized.
- **Priority:** P2

### 5.4 Self-Watering Pot with Hidden Reservoir

- **What it is:** A double-layered pot with a hidden water reservoir that wicks water up into the soil as it dries.
- **Why:** Removes the watering action entirely, but requires users to replace all their existing pots, and costs significantly more.
- **Priority:** P2

### 5.5 Monthly Plant Subscription

- **What it is:** A model that ships a new plant to the user's home every month.
- **Why:** The team assessed that this direction increases the number of plants someone has to care for rather than making them better at caring for plants, so it can be skipped.
- **Priority:** P2 (team suggests this may be dropped)

## 6. Scope: In / Out

[Assumption] Based on the priority order the team settled on, the proposed scope for the first release is as follows:

- **In scope:** Plant-care card planted in the pot.
- **Consider for a later phase (In, phase 2):** Moisture sensor with notifications.
- **Out of initial scope:** Watering-reminder app, self-watering pot with hidden reservoir.
- **Dropped (Out):** Monthly plant subscription.

## 7. Differentiation & Risks

The core differentiator versus other plant-care products is that this solution doesn't try to remind the user at the right moment — it teaches them to read the plant standing in front of them. After one season of using the card, the grower can tell just by looking at the leaves, and the card becomes unnecessary — that is the intended outcome, not a product failure.

Key risks the team identified:

- The card might be treated as a promotional flyer that comes with the pot and get thrown away right after purchase.
- The watering rhythm printed on the card is only valid within a certain range of conditions; a west-facing balcony in harsh sun and a north-facing, low-light window can't share the same rhythm.
- A grower might read the card once and never look at it again, so it stops being useful right when the plant starts having problems.

## 8. Success Metrics

[Assumption] The team has not yet discussed specific measurement targets. Qualitative metrics worth considering include: the self-reported plant survival rate after the first season, how often growers go on to buy another pot, and whether growers start recognizing signs of underwatering on their own without needing to check the card anymore.

## 9. Assumptions & Open Questions

- [Assumption] §3 (User Stories & Scenarios): the scenario was reconstructed from the team's insight about growers having to guess the plant's condition; the team did not describe a specific chronological situation.
- [Assumption] §6 (Scope In/Out): the phase breakdown was inferred directly from the priority order the team settled on; the team did not use an in-scope/out-of-scope framework during discussion.
- [Assumption] §8 (Success Metrics): the team did not discuss measurement metrics; the metrics above were inferred from the agreed-upon problem and features.
- Open question: the team has not decided whether the card will be sold separately or bundled with the pot at purchase.
- Open question: the team has not determined which species will have a card in the first release.
