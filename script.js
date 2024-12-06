const form = document.getElementById('registrationForm');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
let imageBase64;

const validateField = (field, pattern, errorMessage, errorElement) => {
    if (!pattern.test(field.value)) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        errorElement.textContent = errorMessage;
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        errorElement.textContent = '';
    }
};

const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.querySelector('.eye-icon').classList.toggle('fa-eye');
    togglePassword.querySelector('.eye-icon').classList.toggle('fa-eye-slash');
});

document.getElementById('name').addEventListener('input', function() {
    const namePattern = /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/;
    this.value = this.value.replace(/\b\w/g, char => char.toUpperCase());
    validateField(this, namePattern, "Each word must start with a capital letter.", document.getElementById('nameError'));
});

document.getElementById('email').addEventListener('input', function() {
    const emailPattern = /^[a-z]+@[a-z]+\.(com|in|org)$/;
    this.value = this.value.toLowerCase();
    validateField(this, emailPattern, "Please enter a valid email.", document.getElementById('emailError'));
});

document.getElementById('contact').addEventListener('input', function() {
    const contactPattern = /^[0-9]{10}$/;
    validateField(this, contactPattern, "Please enter a valid 10-digit contact number.", document.getElementById('contactError'));
});

document.getElementById('dob').addEventListener('input', function() {
    validateField(this, /.+/, "DOB is required.", document.getElementById('dobError'));
});

document.getElementById('gender').addEventListener('change', function() {
    validateField(this, /.+/, "Gender selection is required.", document.getElementById('genderError'));
});

document.getElementById('education').addEventListener('change', function() {
    validateField(this, /.+/, "Education selection is required.", document.getElementById('educationError'));
});

document.getElementById('username').addEventListener('input', function() {
    const usernamePattern = /^[a-zA-Z0-9]{3,}$/;
    validateField(this, usernamePattern, "Username must be at least 3 characters long and contain only letters and numbers.", document.getElementById('usernameError'));
});

document.getElementById('password').addEventListener('input', function() {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    validateField(this, passwordPattern, "Password must be at least 8 characters long, contain at least one uppercase letter and one number.", document.getElementById('passwordError'));
});

document.getElementById('pan').addEventListener('input', function() {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    validateField(this, panPattern, "Please enter a valid PAN number.", document.getElementById('panError'));
});

document.getElementById('profilePic').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageBase64 = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput').value;

    const filteredProfiles = profiles.filter(profile => {
        const dob = new Date(profile.dob);
        const age = Math.floor((new Date() - dob) / (1000 * 60 * 60 * 24 * 365));
        return profile.name.toLowerCase().includes(searchInput.toLowerCase()) || age <= parseInt(searchInput, 10) || profile.profilePic.size / 1024 <= parseInt(searchInput, 10);
    });

    
    displaySearchResults(filteredProfiles);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProfile = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        contact: document.getElementById('contact').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        education: document.getElementById('education').value,
        occupation: document.getElementById('occupation').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        pan: document.getElementById('pan').value,
        profilePic: { base64: imageBase64 }
    };

    profiles.push(newProfile);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    alert("Profile saved successfully!");
    form.reset();
});

const displaySearchResults = (profiles) => {
    searchResults.innerHTML = '';
    if (profiles.length === 0) {
        searchResults.innerHTML = '<p>No results found.</p>';
        return;
    }
    profiles.forEach(profile => {
        const profileDiv = document.createElement('div');
        profileDiv.className = 'card mb-2';
        profileDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${profile.name}</h5>
                <p class="card-text">Email: ${profile.email}</p>
                <p class="card-text">Contact: ${profile.contact}</p>
                <p class="card-text">DOB: ${profile.dob}</p>
                <p class="card-text">Gender: ${profile.gender}</p>
                <p class="card-text">Education: ${profile.education}</p>
                <p class="card-text">Occupation: ${profile.occupation || 'N/A'}</p>
                <p class="card-text">PAN: ${profile.pan}</p>
                <p class="card-text">Profile Picture: <img src="${profile.profilePic.base64}" alt="Profile Picture" style="width: 100px; height: 100px;"></p>
            </div>
        `;
        searchResults.appendChild(profileDiv);
    });
};
