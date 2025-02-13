// package main

// import (
// 	"fmt"
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// )

// type Car struct {
// 	ID     string `"json: id"`
// 	Number string `"json: number"`
// 	Model  string `"json: model"`
// 	Type   string `"json: type"`
// }

// var cars []Car = []Car{
// 	{ID: "1", Number: "123", Model: "Toyota", Type: "Sedan"},
// 	{ID: "2", Number: "456", Model: "Honda", Type: "SUV"},
// }
// func createCar(c *gin.Context) {
// 	var car Car
// 	if err := c.BindJSON(&car); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	cars = append(cars, car)
// 	c.JSON(http.StatusCreated, gin.H{"message": " car created successfully",
// 		"car": createCar})
// }
// func readcarsbyId(c *gin.Context) {
// 	id := c.Param("id")
// 	for _, car := range cars {
// 		if car.ID == id {
// 			c.JSON(http.StatusOK, car)
// 			return
// 		}
// 	}
// 	c.JSON(http.StatusNotFound, gin.H{"error": "car not found"})
// }

// func getCars(c *gin.Context) {
// 	fmt.Println(cars)
// 	c.JSON(http.StatusOK, cars)

// }

// func main() {
// 	r := gin.Default()
// 	//r.Use(cors.Default())
// 	r.GET("/cars", getCars)
// 	r.GET("/cars/:id", readcarsbyId)
// 	r.POST("/cars", createCar)
// 	//r.PUT("/cars/:id", updateCar)
// 	//r.DELETE("/cars/:id", deleteCar)
// 	r.Run(":8080")
// }
