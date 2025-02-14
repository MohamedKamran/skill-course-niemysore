package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Config
var mongoUri string = "mongodb://localhost:27017"
var mongoDbName string = "gameserver"
var mongoCollectionGame string = "games"

// Database variables
var mongoclient *mongo.Client
var gameCollection *mongo.Collection

// Model Game for Collection "games"
type Game struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	NoOfPlayers int                `json:"no_of_players" bson:"no_of_players"`
	Ratings     float64            `json:"ratings" bson:"ratings"`
}

// Connect to MongoDB
func connectDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var errrorConnection error
	mongoclient, errrorConnection = mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))
	if errrorConnection != nil {
		log.Fatal("MongoDB Connection Error:", errrorConnection)
	}

	gameCollection = mongoclient.Database(mongoDbName).Collection(mongoCollectionGame)
	fmt.Println("Connected to MongoDB!")
}

// POST /games
func createGame(c *gin.Context) {
	var game Game

	if err := c.BindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := gameCollection.InsertOne(ctx, game)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create game"})
		return
	}

	gameId, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse inserted ID"})
		return
	}
	game.ID = gameId

	var createdGame Game
	err = gameCollection.FindOne(ctx, bson.M{"_id": game.ID}).Decode(&createdGame)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch created game"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Game created successfully",
		"game":    createdGame,
	})
}

// GET /games
func readAllGames(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := gameCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch games"})
		return
	}
	defer cursor.Close(ctx)

	var games []Game
	if err := cursor.All(ctx, &games); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse games"})
		return
	}

	c.JSON(http.StatusOK, games)
}

// GET /games/:id
func readGameById(c *gin.Context) {
	id := c.Param("id")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var game Game
	err = gameCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&game)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		return
	}

	c.JSON(http.StatusOK, game)
}

// PUT /games/:id
func updateGame(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var game Game
	if err := c.BindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := gameCollection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{
			"title":         game.Title,
			"description":   game.Description,
			"no_of_players": game.NoOfPlayers,
			"ratings":       game.Ratings,
		}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update game"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Game updated successfully",
	})
}

// DELETE /games/:id
func deleteGame(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := gameCollection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete game"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Game deleted successfully"})
}

func main() {
	connectDB()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/games", createGame)
	r.GET("/games", readAllGames)
	r.GET("/games/:id", readGameById)
	r.PUT("/games/:id", updateGame)
	r.DELETE("/games/:id", deleteGame)

	r.Run(":8080")
}
