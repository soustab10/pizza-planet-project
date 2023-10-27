const validateForm = (form) => (value) => {
    let errors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const numberRegex = /\d/;
    const vehicleRegex  = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
    const pinRegex = /^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$/;
    if (form === "newsletter") {
        if (!value.email) {
            errors.email = "Please enter an email"
        }
        else if (!emailRegex.test(value.email)) {
            errors.email = "Please enter valid email"
        }
    }
    else if (form === "registration") {
        if (!value.first_name) {
            errors.first_name = "Please enter First name"
        }
        else if (value.first_name.length < 3) {
            errors.first_name = "Name is too short"
        }
        if (!value.last_name) {
            errors.last_name = "Please enter Last name"
        }
        else if (value.last_name.length < 3) {
            errors.last_name = "Name is too short"
        }
        if (!value.email) {
            errors.email = "Please enter email"
        }
        else if (!emailRegex.test(value.email)) {
            errors.email = "Please enter valid email"
        }
        // else if (!vehicleRegex.test(value.vehicle_number)) {
        //     errors.vehicle = "Please enter valid Vehicle Number"
        // }
        if (!value.username) {
            errors.username = "Please enter username"
        }
        
        if (!value.house_number) {
            errors.house_number = "Please enter House Number"
        }
        
        if (!value.street_name) {
            errors.street_name = "Please enter Street Name"
        }
        
        if (!value.city) {
            errors.city = "Please enter City"
        }
        
        if (!value.state) {
            errors.state = "Please enter State"
        }
        
        if (!value.pincode) {
            errors.pincode = "Please enter Pincode"
        }
       
        if (!value.password) {
            errors.password = "Please enter a valid password"
        }
        if (!value.repeatPassword) {
            errors.repeatPassword = "Please repeat the password"
        }
        if (value.password !== value.repeatPassword) {
            errors.password = "Passwords don't match"
        }
    }
    else if (form === "partner_dashboard") {
        if (!value.first_name) {
            errors.first_name = "Please enter First name"
        }
        else if (value.first_name.length < 3) {
            errors.first_name = "Name is too short"
        }
        if (!value.last_name) {
            errors.last_name = "Please enter Last name"
        }
        else if (value.last_name.length < 3) {
            errors.last_name = "Name is too short"
        }       
        
        if (!value.city) {
            errors.city = "Please enter City"
        }

        if(!value.phone_number){
            errors.phone_number = "Please enter Phone Number"
        }

        if(!value.vehicle_number){
            errors.vehicle_number = "Please enter Vehicle Number"
        }
        
        
        
    }

    else if (form === "profile") {
        if (!value.first_name) {
            errors.first_name = "Please enter First Name"
        }
        else if (value.first_name.length !== 0 && value.first_name.length < 3) {
            errors.first_name = "First name is too short"
        }
        if (!value.last_name) {
            errors.last_name = "Please enter First Name"
        }
        else if (value.last_name.length !== 0 && value.last_name.length < 3) {
            errors.last_name = "First name is too short"
        }
        
        // if (!value.email) {
        //     errors.email = "Please enter Email"
        // }
        // if (value.email.length !== 0 && !emailRegex.test(value.email)) {
        //     errors.email = "Please enter valid email"
        // }
        if (!value.house_number) {
            errors.house_number = "Please enter House Number"
        }
        if (!value.street_name) {
            errors.street_name = "Please enter Street Name"
        }
        if (!value.city) {
            errors.city = "Please enter City"
        }
        if (!value.state) {
            errors.state = "Please enter State"
        }
        if (!value.pincode) {
            errors.pincode = "Please enter Pincode"
        }
        // if(!value.number){
        //     errors.number = "Please enter Phone Number"
        // }
        
        
    }
    else if (form === "login") {
        if (!value.email) {
            errors.email = 'Please enter email';
        } else if (!emailRegex.test(value.email)) {
            errors.email = 'Please enter valid email';
        }

        if (!value.password) {
            errors.password = 'Please enter a valid password';
        }
    }
    else if (form === "contact") {
        if (!value.fullname) {
            errors.fullname = "Please enter your full name"
        }
        else if (numberRegex.test(value.fullname)) {
            errors.fullname = "Please enter a valid full name"
        }
        else if (value.fullname && value.fullname.length < 3) {
            errors.fullname = "Please enter a valid full name"
        }
        if (!value.email) {
            errors.email = "Please enter an email"
        }
        else if (!emailRegex.test(value.email)) {
            errors.email = "Please enter valid email"
        }
        if (!value.message) {
            errors.message = "Please write a message"
        }
        else if (value.message && value.message.length < 10) {
            errors.message = "The message should be min. 10 characters"
        }
    }
    else if (form === "payment") {
        if (!value.firstname) {
            errors.firstname = "Please enter first name"
        }
        if (!value.lastname) {
            errors.lastname = "Please enter last name"
        }
        if (!value.cardNumber || value.cardNumber.length < 16) {
            errors.cardNumber = "Please enter a valid card number"
        }
        if (!value.cvv || value.cvv.length < 3) {
            errors.cvv = "Please enter valid CVV"
        }
        if (!value.month || value.month > 12 || value.month < 1) {
            errors.year = "Please enter valid month"
        }
        if (!value.year || value.year > 50 || value.year < 23) {
            errors.year = "Please enter valid year"
        }
    }

    return errors;
}

export default validateForm;