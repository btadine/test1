# blockchain-developer-bootcamp-final-project
Final Project of Consensys Ethereum Bootcamp

## Cityhacks: A decentralized city-based suggestion feed 

### The Problem

When visiting a new city for pleasure or work, it's highly likely to end up in the most touristical places. Even if staying longer, most people need a phase of adaptation where they find where the good things happen or are located. The average person is likely to reproduce a very touristic trip in a span of a few days, not enjoying the good things only local people are aware of. In opposition, locals and reallocated persons know the cheapest place to take a good beer, the quieter spot in the city with amazing views, or the cofee place where you can work for free.

### The Solution

A decentralized city-based suggestion feed including different categories (ie. cheap/nice spot/traditional/parking/coworking).

### The Workflow

1. A user creates a new suggestion (AKA "City hack") indicating a city and a category.
2. When posted, the suggestion leads to a transaction with the smart contract where the suggestion id is stored. The model is stored in IPFS.
3. Each time a new suggestion is created, an event is emitted.
4. The frontend filters suggestions analyzing all the events to date emitted by the SC. The suggestions feed is refreshed with the new suggestion. 
5. A user can upvote or downvote a suggestion, which costs gas as a way to prevent spam.
6. A user can tip a poster to the original address used for the suggestion creation.
7. When a tip is made, an event with the address of the donator is emitted.
8. Hex/ENS addresses of donors are shown inside of the suggestion.

### The Rules
1. The original poster address can't vote his own suggestion.
2. The same address can't vote twice for a suggestion.


