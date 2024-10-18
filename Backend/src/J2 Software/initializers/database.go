package initializers

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDB() {
	var err error
	//dsn := os.Getenv("DB_Conn")

	//dsn := os.Getenv("DB_Conn")

	dsn := "admin:train456#@tcp(127.0.0.1:3306)/AthenaDB?charset=utf8mb4&parseTime=True&loc=Local"
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database")
	}
}
