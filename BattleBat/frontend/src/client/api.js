// A simple data API that will be used to get the data for our
// components. On a real website, a more robust data fetching
// solution would be more appropriate.
const UsersAPI = {
  players: [
    { id: 1, name: "Ben Blocker", position: "G" },
    { id: 2, name: "Dave Defender", position: "D" },
    { id: 3, name: "Sam Sweeper", position: "D" },
    { id: 4, name: "Matt Midfielder", position: "M" },
    { id: 5, name: "William Winger", position: "M" },
    { id: 6, name: "Fillipe Forward", position: "F" }
  ],
  all: function() { return this.players},
  get: function(id) {
    const isPlayer = p => p.id === id
    return this.players.find(isPlayer);
  }
}

export default UsersAPI;
