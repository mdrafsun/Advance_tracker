class User {
    #userId;
    #name;
    #email;
    #password;
    #phone;
    #balanceID;

    constructor(userId, name, email, password, phone, balanceID) {
        this.#userId = userId;
        this.#name = name;
        this.#email = email;
        this.#password = password;
        this.#phone = phone;
        this.#balanceID = balanceID;
    }

    updateProfile({ name, email, phone }) {
        if (name !== undefined) this.#name = name;
        if (email !== undefined) this.#email = email;
        if (phone !== undefined) this.#phone = phone;
    }

    notify(message) {
        // Simulate sending a notification (e.g., email or SMS)
        console.log(`Notification to ${this.#name} (${this.#email}): ${message}`);
    }

    toJSON() {
        return {
            userId: this.#userId,
            name: this.#name,
            email: this.#email,
            phone: this.#phone,
            balanceID: this.#balanceID
            // Note: password is intentionally excluded for security
        };
    }

    // Getters
    getUserId() { return this.#userId; }
    getName() { return this.#name; }
    getEmail() { return this.#email; }
    getPassword() { return this.#password; }
    getPhone() { return this.#phone; }
    getBalanceID() { return this.#balanceID; }

    // Setters
    setName(name) { this.#name = name; }
    setEmail(email) { this.#email = email; }
    setPassword(password) { this.#password = password; }
    setPhone(phone) { this.#phone = phone; }
    setBalanceID(balanceID) { this.#balanceID = balanceID; }
}

// Child class for individual users
class IndividualUser extends User {
    #age;
    #profession;
    #gender;
    #userType;

    constructor(userId, name, email, password, phone, balanceID, age, profession, gender) {
        super(userId, name, email, password, phone, balanceID);
        this.#age = age;
        this.#profession = profession;
        this.#gender = gender;
        this.#userType = 'individual';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            age: this.#age,
            profession: this.#profession,
            gender: this.#gender,
            userType: this.#userType
        };
    }

    // Getters
    getAge() { return this.#age; }
    getProfession() { return this.#profession; }
    getGender() { return this.#gender; }
    getUserType() { return this.#userType; }

    // Setters
    setAge(age) { this.#age = age; }
    setProfession(profession) { this.#profession = profession; }
    setGender(gender) { this.#gender = gender; }
}

// Child class for business users
class BusinessUser extends User {
    #businessName;
    #businessRegNo;
    #userType;

    constructor(userId, name, email, password, phone, balanceID, businessName, businessRegNo) {
        super(userId, name, email, password, phone, balanceID);
        this.#businessName = businessName;
        this.#businessRegNo = businessRegNo;
        this.#userType = 'business';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            businessName: this.#businessName,
            businessRegNo: this.#businessRegNo,
            userType: this.#userType
        };
    }

    // Getters
    getBusinessName() { return this.#businessName; }
    getBusinessRegNo() { return this.#businessRegNo; }
    getUserType() { return this.#userType; }

    // Setters
    setBusinessName(businessName) { this.#businessName = businessName; }
    setBusinessRegNo(businessRegNo) { this.#businessRegNo = businessRegNo; }
}

export default {
    User,
    IndividualUser,
    BusinessUser
};
