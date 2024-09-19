package Controllers

import (
	"J2Software/initializers"
	"J2Software/models"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"net/smtp"
	"fmt"
	"math/rand"
	"time"

	"github.com/gin-gonic/gin"
)

func generateAuthCode() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

func sendEmail(to string, authCode string) error {
	from := "juankrug2020@gmail.com"
	password := "kxcd wrpu iffs qtpq"

	msg := fmt.Sprintf("Subject: Your Authentication Code\n\nYour authentication code is: %s", authCode)

	auth := smtp.PlainAuth("", from, password, "smtp.gmail.com")

	err := smtp.SendMail("smtp.gmail.com:587", auth, from, []string{to}, []byte(msg))
	return err
}

func Login(c *gin.Context) {
	var loginData struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.Users
	result := initializers.DB.Where("Username = ?", loginData.Username).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	hashedPassword := sha256.Sum256([]byte(loginData.Password))
	hashedPasswordHex := hex.EncodeToString(hashedPassword[:])

	if user.PasswordHash != hashedPasswordHex {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	authCode := generateAuthCode()

	go func() {
		err := sendEmail(user.Username, authCode)
		if err != nil {
			fmt.Println("Error sending email:", err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "userId": user.UserID, "authCode": authCode})
}

func VerifyAuthCode(c *gin.Context) {
	var verifyData struct {
		UserID   int    `json:"userId" binding:"required"`
		AuthCode string `json:"authCode" binding:"required"`
	}

	if err := c.ShouldBindJSON(&verifyData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if verifyData.AuthCode == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authentication code"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Authentication successful"})
}

func ResendCode(c *gin.Context) {
	var requestData struct {
		UserID int `json:"userId"`
	}

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.Users
	result := initializers.DB.Where("UserID = ?", requestData.UserID).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	authCode := generateAuthCode()

	go func() {
		err := sendEmail(user.Username, authCode)
		if err != nil {
			fmt.Println("Error resending email:", err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Code resent successfully", "newAuthCode": authCode})
}