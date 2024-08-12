package models

import (
	"time"
)

type EventLogs struct {
	EventID        uint      `gorm:"column:EventID;primaryKey;autoIncrement"`
	Category       string    `gorm:"column:Category;type:varchar(50);not null"`
	Method         string    `gorm:"column:Method;type:varchar(50);not null"`
	Username       string    `gorm:"column:Username;type:varchar(50);not null"`
	IPAddress      string    `gorm:"column:IPAddress;type:varchar(15);not null"`
	EventTimeStamp time.Time `gorm:"column:EventTimeStamp;type:datetime;not null"`
	Severity       string    `gorm:"column:Severity;type:varchar(50);not null"`
}

// TableName overrides the default table name used by GORM
func (EventLogs) TableName() string {
	return "EventLogs"
}
