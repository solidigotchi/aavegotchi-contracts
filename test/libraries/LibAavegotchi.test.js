const { expect } = require("chai");
const { ethers } = require("hardhat");
const truffleAssert = require("truffle-assertions");
const {deployContract, getDeployedContract} = require("../utils/deployUtils");
const {setup} = require("../utils/setup");


describe("LibAavegotchi", () => {

    let Contract;
    beforeEach(async () => {
        Contract = (await deployContract("LibAavegotchiTestFacet"))
    })
   
    
    describe("toNumericTraits", async () => {

        it('should revert when AppStorage.collateralTypes.length == 0', async () => {
            const randomNumber = 1
            const option = 1
            truffleAssert.fails(Contract.t_toNumericTraits(randomNumber, option))
        })
    })


    describe("rarityMultiplier", () => {

        // This isn't possible to test?
        // it('should return 10 when baseRarity is < 300', async () => {

        //     const numericTraits = [50,50,50,50,50,50]

        //     const score = await Contract.t_baseRarityScore(numericTraits)

        //     expect(score < 300).to.equal(true)

        //     const expected = 10

        //     const multiplier = await Contract.t_rarityMultiplier(numericTraits)

        //     expect(multiplier).to.equal(expected)
        // })

        it('should return 10 when baseRarity is <= 449', async () => {

            const numericTraits = [50,50,50,50,50,-94]

            const score = await Contract.t_baseRarityScore(numericTraits)

            expect(score).to.equal(449)

            const expected = 10

            const multiplier = await Contract.t_rarityMultiplier(numericTraits)

            expect(multiplier).to.equal(expected)
        })
        

        it('should return 25 when baseRarity is >= 450 && <= 525', async () => {

            const numericTraits = [50,50,50,50,50,-170]

            const score = await Contract.t_baseRarityScore(numericTraits)

            expect(score).to.equal(525)

            const expected = 25

            const multiplier = await Contract.t_rarityMultiplier(numericTraits)

            expect(multiplier).to.equal(expected)
        })

        it('should return 100 when baseRarity is >=526 && <= 580', async () => {

            const numericTraits = [50,50,50,50,50,-225]

            const score = await Contract.t_baseRarityScore(numericTraits)

            expect(score).to.equal(580)

            const expected = 100

            const multiplier = await Contract.t_rarityMultiplier(numericTraits)

            expect(multiplier).to.equal(expected)
        })

        it('should return 1000 when baseRarity is >=581', async () => {

            const numericTraits = [50,50,50,50,50,-226]

            const score = await Contract.t_baseRarityScore(numericTraits)

            expect(score).to.equal(581)

            const expected = 1000

            const multiplier = await Contract.t_rarityMultiplier(numericTraits)

            expect(multiplier).to.equal(expected)
        })



    })

    describe("singlePortalAavegotchiTraits", () => {

    })

    describe("portalAavegotchiTraits", () => {

    })

    describe("getAavegotchi", () => {

    })

    describe("modifiedTraitsAndRarityScore", () => {

    })

    describe("getNumericTraits", () => {

    })

    describe("kinship", () => {

    })

    describe("xpUntilNextLevel", () => {

        it ('should be 0 when experience is greater than 490050 (level 99) ', async () => {

            const experience = 490051

            const expected = 0

            const xp = await Contract.t_xpUntilNextLevel(experience)

        
            expect(xp).to.equal(expected)
        })

        it ('should be 50 when experience is 0 (level 1)', async () => {

            const experience = 0

            const expected = 50

            const xp = await Contract.t_xpUntilNextLevel(experience)

        
            expect(xp).to.equal(expected)
        })

        it ('should return 1 when experience is 1249 (level 5) ', async () => {

            const experience = 1249

            const expected = 1

            const xp = await Contract.t_xpUntilNextLevel(experience)

        
            expect(xp).to.equal(expected)
        })

    })

    describe("aavegotchiLevel", () => {


        it ('should return 99 when experience is greater than 490050 (level 99)', async () => {

            const experience = 490051

            const expected = 99

            const level = await Contract.t_aavegotchiLevel(experience)

            expect(level).to.equal(expected)
        })


        it ('should return 1 when experience is 0', async () => {

            const experience = 0

            const expected = 1

            const level = await Contract.t_aavegotchiLevel(experience)

            expect(level).to.equal(expected)
        })

        it ('should return 5 when experience is 1249', async () => {

            const experience = 1249

            const expected = 5 // Math.sqrt(2 * experience)/10 + 1

            const level = await Contract.t_aavegotchiLevel(experience)

            expect(level).to.equal(expected)
        })

        it ('should return 6 when experience is 1250', async () => {

            const experience = 1250

            const expected = 6 // Math.sqrt(2 * experience)/10 + 1

            const level = await Contract.t_aavegotchiLevel(experience)

            expect(level).to.equal(expected)
        })
    })

    describe("interact", () => {

    })

    describe("baseRarityScore", () => {
        it ("should add 100 to numericTrait when numericTrait is 0", async () => {
            //for 0 the sum is (100 - 0) = 100
            //100 + (50 +1) (*5)
            const numericTraits = [0,50,50,50,50,50]

            const expected = '355'

            const score = await Contract.t_baseRarityScore(numericTraits)

            expect(score).to.equal(expected)
        })

        it ("should add 1 to numericTrait when numericTrait is >= 50", async () => {
            //for 0 the sum is (100 - 0) = 100
            //100*5 + (50 +1)
            const numericTraits = [0,0,0,0,0,50]

            const expected = '551'

            const score = await Contract.t_baseRarityScore(numericTraits)

            expect(score).to.equal(expected)
        })

        it ("should add number to 100 when numericTrait is negative", async () => {
            //for 0 the sum is (100 - -1) = 100
            //100*5 + (101)
            const numericTraits = [0,0,0,0,0,-1]

            const expected = '601'

            const score = await Contract.t_baseRarityScore(numericTraits)

            expect(score).to.equal(expected)
        })
    })

    describe("purchase", () => {

        let config;
        beforeEach(async () => {
            config = await setup()
            Contract = await ethers.getContractAt('LibAavegotchiTestFacet', config.aavegotchiDiamond.address)
        })

        it('should send fees to accounts', async () => {
            
            const purchaseAmount = 100
            
            const expectedBurnShare = '33.0'
            const expectedCompanyShare = '17.0'
            const expectedRarityFarmShare = '40.0'
            const expectedDaoShare = '10.0'

            const Ghost = config.ghstTokenContract

            await Ghost.approve(config.libAavegotchiTestFacet.address,  ethers.utils.parseEther(`${purchaseAmount}`))
            
            await Contract.t_purchase(ethers.utils.parseEther(`${purchaseAmount}`))

            expect(ethers.utils.formatEther(`${await Ghost.balanceOf(config.pixelCraft)}`)).to.equal(expectedCompanyShare)
            expect(ethers.utils.formatEther(`${await Ghost.balanceOf(config.rarityFarming)}`)).to.equal(expectedRarityFarmShare)
            expect(ethers.utils.formatEther(`${await Ghost.balanceOf(config.dao)}`)).to.equal(expectedDaoShare)
            expect(ethers.utils.formatEther(`${await Ghost.balanceOf(config.burnAddress)}`)).to.equal(expectedBurnShare)

        })
    })

    describe("sqrt", () => {

        it ('sqrt should return correct value when x is a perfect sqaure', async () => {

            const x = 9

            const expected = 3

            const value = await Contract.t_sqrt(x);

            expect(value).to.equal(expected);
        })

        it ('sqrt should return correct value when x is not a perfect sqaure', async () => {

            const x = 11

            const expected = 3

            const value = await Contract.t_sqrt(x);

            expect(value).to.equal(expected);
        })

        it ('sqrt should return 0 when x is 0', async () => {

            const x = 0

            const expected = 0

            const value = await Contract.t_sqrt(x);

            expect(value).to.equal(expected);
        })
    })

    describe("validateAndLowerName", () => {
        it ('should revert when length is 0', async () => {
            const name = ''

            const expected = "LibAavegotchi: name can't be 0 chars"

            await truffleAssert.reverts(Contract.t_validateAndLowerName(name), expected);
        })

        it ('should revert when length is 26', async () => {
            const name = 'AAAAAAAAAAAAAAAAAAAAAAAAAA'

            const expected = "LibAavegotchi: name can't be greater than 25 characters";

            await truffleAssert.reverts(Contract.t_validateAndLowerName(name), expected);
        })

        it ('should revert when first char is a space', async () => {
            const name = ' test'

            const expected = "LibAavegotchi: first char of name can't be a space";

            await truffleAssert.reverts(Contract.t_validateAndLowerName(name), expected);
        })

        it ('should revert when last char is a space', async () => {
            const name = 'test '

            const expected = "LibAavegotchi: last char of name can't be a space";

            await truffleAssert.reverts(Contract.t_validateAndLowerName(name), expected);
        })

        it ('should revert when contains char less than 2F', async () => {
            const invalid = "\2F"

            const name = `test${invalid}`

            const expected = `LibAavegotchi: invalid character in Aavegotchi name.`;

            await truffleAssert.reverts(Contract.t_validateAndLowerName(name), expected);
        })

        it ('should revert when contains char greater than 0x7E', async () => {
            const invalid = "\x7F"

            const name = `test${invalid}`

            const expected = `LibAavegotchi: invalid character in Aavegotchi name.`;

            await truffleAssert.reverts(Contract.t_validateAndLowerName(name), expected);
        })

        it ('should lowercase string', async () => {
            const name = "LOWERCaSEMe132"

            const expected = "lowercaseme132"

            const res = await Contract.t_validateAndLowerName(name)

            expect(res).to.equal(expected);
        })
    })

    describe("transfer", () => {

    })


    describe("verify", () => {
        
        it("should not revert when less than 10", async () => {
            await truffleAssert.passes(Contract.t_verify(0)); 
        })

        it("should revert when >= 10", async () =>{
            await truffleAssert.reverts(Contract.t_verify(10), "Not verified");
        })
    })

    



})