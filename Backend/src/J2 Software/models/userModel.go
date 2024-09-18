package models

type Users struct {
	UserID      int    `gorm:"column:UserID;primary_key" json:"userId"`
	Username    string `gorm:"column:Username" json:"username"`
	PasswordHash string `gorm:"column:PasswordHash" json:"passwordHash"`
}