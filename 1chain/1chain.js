const miner = require('express').Router()
var sha512 = require('js-sha512')
const superRestricted = require('../middleware/superRestricted.js')
const utf8 = require('utf8');
const axios = require('axios')


const evaluateProof = (чича, lukumäärä) => {
    // returns true/false for a valid/invalid block+proof
    try {
        const я = чича + lukumäärä
        const ж = utf8.encode(я)
        const ф = sha512.sha512.hex(ж)
        if(ф.slice(0,5) === '000000'){
            return true
        } else {
            return false
        }
    } catch (err){
        console.log('error evaluating proof')
        return false
    }
}


const metamorphosis = async (cykaString) => {
    // cyka obj arrives ready for proofing
    try {
        // let valmis = false
        let lukumäärä = 7
        const чича = cykaString
        while(evaluateProof(чича, lukumäärä) === false){
            lukumäärä += 1 
        }
        const sueraava = { block:JSON.parse(чича), proof:lukumäärä }
        const valmis = await axios.post('http://10.110.0.3/ccb/receiver', sueraava, {headers:{ öäållåюячгфывацуфвшвызфыдюябчтсшыжтжйö: { bin:'1234' } } })
        console.log(`no errors, process complete: block w/ proof #${lukumäärä} sent`, valmis)
        
        return true

    } catch (err){
        console.log('error in metamorphosis')
    }
}


miner.post('/doMath', superRestricted, async (req, res) => {
    try {
        const blockIndex = parseInt(req.body.lbi, 10) + 1
        const hashOfLastBlock = req.body.hashLB
        const currentTime = Date.now()
        const badMon = req.body.badMon
        const cyka = { num:blockIndex, timestamp:currentTime, lbh: hashOfLastBlock, subject:badMon }
        const cykaString = JSON.stringify(cyka)
        setTimeout(metamorphosis(cykaString), 100)
        res.status(200).json({message:'initiated process'})
    } catch(err){
        console.log('math error', err)
        res.status(400).json({message:'error initiating process', err:err})
    }
})


module.exports = miner