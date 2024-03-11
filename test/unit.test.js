

const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Movie API Test', function() {
    let driver;

    this.timeout(10000);

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        
    });

    after(async function() {
        await driver.quit();
    });

    it('should retrieve a movie by ID', async function() {
        // Open a web page where your API is accessible (e.g., "http://localhost:3000/users/123" where 123 is a valid user ID)
        await driver.get('http://localhost:5002/api/movies/6539d906c951fa0c359524e7');

        // Wait for the API response
        await driver.wait(until.elementLocated(By.tagName('pre')), 5000);

        // Get the API response as JSON
        const jsonResponse = await driver.findElement(By.tagName('pre')).getText();
        const user = JSON.parse(jsonResponse);

        // Assert the response contains the expected user properties
        expect(user).to.have.property('_id');
        expect(user).to.have.property('title');
        expect(user).to.have.property('genre');
        expect(user).to.have.property('year');
        expect(user).to.have.property('cast');
        expect(user).to.have.property('runtime');
        expect(user).to.have.property('trailer');
        expect(user).to.have.property('poster');
        // expect(user).to.have.property('genre');

        // Add more assertions as needed
    });
});

describe('User API Test', function() {
    let driver;

    this.timeout(10000);

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        
    });

    after(async function() {
        await driver.quit();
    });

    it('should retrieve a user by ID', async function() {
        // Open a web page where your API is accessible (e.g., "http://localhost:3000/users/123" where 123 is a valid user ID)
        await driver.get('http://localhost:5002/api/users/655047d3dff3c3455825fd7e');

        // Wait for the API response
        await driver.wait(until.elementLocated(By.tagName('pre')), 5000);

        // Get the API response as JSON
        const jsonResponse = await driver.findElement(By.tagName('pre')).getText();
        const user = JSON.parse(jsonResponse);

        // Assert the response contains the expected user properties
        expect(user).to.have.property('_id');
        expect(user).to.have.property('name');
        expect(user).to.have.property('email');
        expect(user).to.have.property('phone_number');
        expect(user).to.have.property('password_hashed');
        expect(user).to.have.property('member');
        expect(user).to.have.property('roles');
        // expect(user).to.have.property('poster');
        // expect(user).to.have.property('genre');

        // Add more assertions as needed
    });
});

describe('Booking API Test', function() {
    let driver;

    this.timeout(10000);

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        
    });

    after(async function() {
        await driver.quit();
    });

    it('should retrieve a booking by ID', async function() {
        // Open a web page where your API is accessible (e.g., "http://localhost:3000/users/123" where 123 is a valid user ID)
        await driver.get('http://localhost:5002/api/bookings/65507dd973493cd8586db834');

        // Wait for the API response
        await driver.wait(until.elementLocated(By.tagName('pre')), 5000);

        // Get the API response as JSON
        const jsonResponse = await driver.findElement(By.tagName('pre')).getText();
        const user = JSON.parse(jsonResponse);

        // Assert the response contains the expected user properties
        expect(user).to.have.property('_id');
        expect(user).to.have.property('buyerId');
        expect(user).to.have.property('purchaseDateTime');
        expect(user).to.have.property('moviePass');
        expect(user).to.have.property('discount');
        expect(user).to.have.property('payment_info');
        // expect(user).to.have.property('roles');
        // expect(user).to.have.property('poster');
        // expect(user).to.have.property('genre');

        // Add more assertions as needed
    });
});


describe('Theatre API Test', function() {
    let driver;

    this.timeout(10000);

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        
    });

    after(async function() {
        await driver.quit();
    });

    it('should retrieve a theatre by ID', async function() {
        // Open a web page where your API is accessible (e.g., "http://localhost:3000/users/123" where 123 is a valid user ID)
        await driver.get('http://localhost:5002/api/theaters/654ae43ee79c11bbe9d373b1');

        // Wait for the API response
        await driver.wait(until.elementLocated(By.tagName('pre')), 5000);

        // Get the API response as JSON
        const jsonResponse = await driver.findElement(By.tagName('pre')).getText();
        const user = JSON.parse(jsonResponse);

        // Assert the response contains the expected user properties
        expect(user).to.have.property('_id');
        expect(user).to.have.property('name');
        expect(user).to.have.property('address');
        expect(user).to.have.property('rooms');
        // expect(user).to.have.property('password_hashed');
        // expect(user).to.have.property('member');
        // expect(user).to.have.property('roles');
        // expect(user).to.have.property('poster');
        // expect(user).to.have.property('genre');

        // Add more assertions as needed
    });
});


