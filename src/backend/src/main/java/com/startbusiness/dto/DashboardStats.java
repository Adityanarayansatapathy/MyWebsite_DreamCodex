package com.startbusiness.dto;

public class DashboardStats {
    
    private Long totalUsers;
    private Long activeUsers;
    private Long inactiveUsers;
    private Long totalBusinesses;
    private Long newRegistrations;
    private Long recentLogins;
    private Double growthRate;
    
    // Default constructor
    public DashboardStats() {}
    
    // Constructor
    public DashboardStats(Long totalUsers, Long activeUsers, Long inactiveUsers, 
                         Long totalBusinesses, Long newRegistrations, 
                         Long recentLogins, Double growthRate) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
        this.totalBusinesses = totalBusinesses;
        this.newRegistrations = newRegistrations;
        this.recentLogins = recentLogins;
        this.growthRate = growthRate;
    }
    
    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }
    
    public Long getActiveUsers() {
        return activeUsers;
    }
    
    public void setActiveUsers(Long activeUsers) {
        this.activeUsers = activeUsers;
    }
    
    public Long getInactiveUsers() {
        return inactiveUsers;
    }
    
    public void setInactiveUsers(Long inactiveUsers) {
        this.inactiveUsers = inactiveUsers;
    }
    
    public Long getTotalBusinesses() {
        return totalBusinesses;
    }
    
    public void setTotalBusinesses(Long totalBusinesses) {
        this.totalBusinesses = totalBusinesses;
    }
    
    public Long getNewRegistrations() {
        return newRegistrations;
    }
    
    public void setNewRegistrations(Long newRegistrations) {
        this.newRegistrations = newRegistrations;
    }
    
    public Long getRecentLogins() {
        return recentLogins;
    }
    
    public void setRecentLogins(Long recentLogins) {
        this.recentLogins = recentLogins;
    }
    
    public Double getGrowthRate() {
        return growthRate;
    }
    
    public void setGrowthRate(Double growthRate) {
        this.growthRate = growthRate;
    }
    
    @Override
    public String toString() {
        return "DashboardStats{" +
                "totalUsers=" + totalUsers +
                ", activeUsers=" + activeUsers +
                ", inactiveUsers=" + inactiveUsers +
                ", totalBusinesses=" + totalBusinesses +
                ", newRegistrations=" + newRegistrations +
                ", recentLogins=" + recentLogins +
                ", growthRate=" + growthRate +
                '}';
    }
}