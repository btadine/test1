# Pseudocode events/functions of the contract

## Events
- event newSuggestion(city: indexed City, category: indexed Category, poster: indexed Address, id: Int)
- event suggestionDeleted(id: Int)
- event suggestionVoted(id: Int, voter: Address)
- event suggestionTipped(id Int, donor: Address)

## Functions
#### func post suggestion(category Category, city City, description, String)
- require limit of suggestions in time to avoid spam
- require description to be 280 characters max (Twitter standard)
- require city and category to exist
- add suggestion under a mapping of mappings -> [City: [Categories : Suggestions]]. Maybe add Categories as key since they don't change.
- emit newSuggestion event

#### func delete suggestion(suggestionid Int)
- require sender address to match poster address 
- remove suggestion or suggestionId from mapping
- emit suggestionDeleted event

#### func vote suggestion(upvote bool, suggestionId: Int)
- require suggestionId to exist
- require msg.sender to not have voted before for the same suggestion (keep votes in suggestion model?)
- emit suggestionVoted event

#### func tip poster (tipAmount) payable
- require msg.sender to be different than poster?
- transfer tipAmount to the poster address
- include msg.sender in the suggestion model under a tippers array? 
- emit suggestionTipped event

#### P.S. It may be enough to retrieve vote and tip events to show in the frontend instead of storing them in the contract.
#### P.S.2. Think about photo support.

## Frontend
- Use block time to order events
