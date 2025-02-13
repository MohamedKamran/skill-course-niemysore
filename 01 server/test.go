package main
import "fmt"
        

func main(){
    myMap := make(map[string]int)
	myMap["apple"] = 1
	myMap["banana"] = 2
	fmt.Println(myMap["apple"])
    value, ok := myMap["grape"]
	if ok{
		fmt.Println(value)
	}else{
		fmt.Println("key not found")
	}
	delete(myMap,"banana")
	fmt.Println(myMap)
	for key, value := range myMap{
		fmt.Printf("key: %s, Value: %d\n",key, value)
	}
}
