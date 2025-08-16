class User {
    constructor(userId, name, email, password, phone, balanceID) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.balanceID = balanceID;

    }

    updateEmail(newEmail) {
        this.email = newEmail;
    }

    updateProfile({ name, email, phone }) {
        if (name !== undefined) this.name = name;
        if (email !== undefined) this.email = email;
        if (phone !== undefined) this.phone = phone;
    }

    notify(message) {
        // Simulate sending a notification (e.g., email or SMS)
        console.log(`Notification to ${this.name} (${this.email}): ${message}`);
    }

    toJSON() {
        return {
            userId: this.userId,
            name: this.name,
            email: this.email,
            phone: this.phone,
            balanceID: this.balanceID
            // Note: password is intentionally excluded for security
        };
    }
}

// Child class for individual users
class IndividualUser extends User {
    constructor(userId, name, email, password, phone, balanceID, age, profession, gender) {
        super(userId, name, email, password, phone, balanceID);
        this.age = age;
        this.userType = 'individual';
        this.profession = profession;
        this.gender = gender;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            age: this.age,
            profession: this.profession,
            gender: this.gender,
            userType: this.userType
        };
    }
}

// Child class for business users
class BusinessUser extends User {
    constructor(userId, name, email, password, phone, balanceID, businessName, businessRegNo) {
        super(userId, name, email, password, phone, balanceID);
        this.businessName = businessName;
        this.businessRegNo = businessRegNo;
        this.userType = 'business';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            businessName: this.businessName,
            businessRegNo: this.businessRegNo,
            userType: this.userType
        };
    }
}


export default {
    User,
    IndividualUser,
    BusinessUser
};
