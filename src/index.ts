import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"

import { typeDefs } from "./schema.js";

import db from "./_db.js";
 
const resolvers = {
    Query: {
        reviews () {
            return db.reviews
        },
        review (_, args) {
            return db.reviews.find(review => review.id === args.id)
        },
        games () {
            return db.games
        },
        game (_, args) {
            return db.games.find(game => game.id === args.id)
        },
        authors () {
            return db.authors
        },
        author (_, args) {
            return db.authors.find(author => author.id === args.id)
        }
    },
    Review: {
        game (parent) {
            return db.games.find(g => g.id === parent.game_id)
        },
        author (parent) {
            return db.authors.find(a => a.id === parent.author_id);
        }
    },
    Author: {
        reviews (parent) {
            return db.reviews.filter(r => r.author_id === parent.id)
        }
    },
    Game: {
        reviews (parent) { 
            return db.reviews.filter(r => r.game_id === parent.id)
        }
    },
    Mutation: {
        deleteGame (_, args) { 
            return db.games.filter(game => game.id !== args.id)
        },
        addGame (_, args) { 
            const game = {
                ...args.game,
                id: Math.floor(Math.random() * 1000)
            }
            console.log(game)
            db.games.push(game)
            return game
        },
        updateGame (_, args) { 
            db.games =  db.games.map(game => {
                if (args.id === game.id)
                { 
                    return { ...game, ...args.game }
                }

                return game
            })
                
            return db.games.find(game => game.id === args.id)
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log('server started at port 4000')

// example query 
// query for game
/**
 * query gameQuery($id: ID!){
 *   game(id: $id) {
 *      id
 *       title,
 *       platform
 *       reviews {
 *       id
 *       rating
 *       content
 *       }
 *   }
 * }
 */