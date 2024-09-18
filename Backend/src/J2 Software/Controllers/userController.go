package Controllers

import (
	"J2Software/initializers"
	"J2Software/models"
	"crypto/sha256"
	"encoding/hex"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var loginData struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Find user in the database by username
	var user models.Users
	result := initializers.DB.Where("Username = ?", loginData.Username).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Hash the input password using SHA-256
	hashedPassword := sha256.Sum256([]byte(loginData.Password))
	hashedPasswordHex := hex.EncodeToString(hashedPassword[:])

	// Compare the hashed password with the one in the database
	if user.PasswordHash != hashedPasswordHex {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Successful login
	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "userId": user.UserID})
}
