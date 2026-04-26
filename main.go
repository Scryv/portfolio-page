package main

import (
	"fmt"
	"html/template"
	_ "io"
	"log"
	"net/http"
)

func Root(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("index.html"))
	tmpl.Execute(w, nil) //change nil to value to parse to index.html

}
func main() {
	fmt.Println("test")

	mux := http.NewServeMux()

	fs := http.FileServer(http.Dir("./static")) //to get static stuff like css pictures etc
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	mux.HandleFunc("/", Root)

	log.Fatal(http.ListenAndServe(":8000", mux))

}
