function createDie(num) {
    let minRoll = 1;

    switch(num) {
        //1d4
        case 1:
            return {
                dieType: "1d4",
                maxRoll: 4,
                averageRoll: 2.5,
            };
        //1d6
        case 2:
            return {
                dieType: "1d6",
                maxRoll: 6,
                averageRoll: 3.5,
            };
        //1d8
        case 3:
            return {
                dieType: "1d8",
                maxRoll: 8,
                averageRoll: 4.5,
            };
        //1d10
        case 4:
            return {
                dieType: "1d10",
                maxRoll: 10,
                averageRoll: 5.5,
            };
        //1d12
        case 5:
            return {
                dieType: "1d12",
                maxRoll: 12,
                averageRoll: 6.5,
            };
    }
}

function rollDie(max) {
    return Math.floor(Math.random() * (max - 1 + 1) + 1);
}


function createBaseStatDie(num) {
    switch(num) {
        //1d4
        case 1:
            return [createDie(1)];
        //1d6
        case 2:
            return [createDie(2)];
        //1d8
        case 3:
            return [createDie(3)];
        //1d10
        case 4:
            return [createDie(4)];
        //1d12
        case 5:
            return [createDie(5)];
        //2d8
        case 6:
            return [createDie(3), createDie(3)];
    }
}

function createAddedStatDie(num) {
    switch(num) {
        //2d4
        case 1:
            return [createDie(1), createDie(1)];
        //1d6 + 1d4
        case 2:
            return [createDie(2), createDie(1)];
        //2d6
        case 3:
            return [createDie(2), createDie(2)];
        //1d8 + 1d6
        case 4:
            return [createDie(3), createDie(2)];
        //2d8
        case 5:
            return [createDie(3), createDie(3)];
        //1d10 + 1d8
        case 6:
            return [createDie(4), createDie(3)];
        //2d10
        case 7:
            return [createDie(4), createDie(4)];
        //1d12 + 1d10
        case 8:
            return [createDie(5), createDie(4)];
        //2d12
        case 9:
            return [createDie(5), createDie(5)];
        //2d8 + 1d12
        case 10:
            return [createDie(3), createDie(3), createDie(5)];
        //4d8
        case 11:
            return [createDie(3), createDie(3), createDie(3), createDie(3)];
    }
}

//similar to createBaseStatDie
function createCombatStageDie(num) {
    switch(num) {
        case 0:
            return [];
        //1d4
        case 1:
            return [createDie(1)];
        //1d6
        case 2:
            return [createDie(2)];
        //1d8
        case 3:
            return [createDie(3)];
        //1d10
        case 4:
            return [createDie(4)];
        //1d12
        case 5:
            return [createDie(5)];
        //2d8
        case 6:
            return [createDie(3), createDie(3)];
    }
}

//maybe temporary?
//the numbers are from rounding down, but according to rules we round up
function getCombatStageAverage(num) {
    switch(num) {
        //1d4
        case 1:
            return 2;
        //1d6
        case 2:
            return 3;
        //1d8
        case 3:
            return 4;
        //1d10
        case 4:
            return 5;
        //1d12
        case 5:
            return 6;
        //2d8
        case 6:
            return 8;
    }
}


function calculateHit(){

}

function calculateRawDamage() {

    let moveData = moveStats();

    let diceCollection; //rename to relevantAttackDice
    let totalRawDamage = 0;
    

    diceCollection = chooseDamageType();
    console.log(diceCollection);

    //BP
    console.log("Base Power: " + moveData.basePower);
    totalRawDamage += moveData.basePower;

    //STAB
    console.log("Damage before STAB: " + totalRawDamage);
    totalRawDamage += moveData.stabDamage;
    console.log("Damage after STAB: " + totalRawDamage);


    //Adding base damage and added damage rolls
    let rollValueList = [];
    for (let i = 0; i < diceCollection.length; i++)  {
        let temp = rollDie(diceCollection[i].maxRoll);
        console.log("Roll Value: " + temp)
        rollValueList.push(temp);
        totalRawDamage += temp;
    }
    console.log("Damage after base and added: " + totalRawDamage);


    //Combat Stage
    let combatStageModifierData = calculateCombatStageModifier();
    console.log("testing combat modifier number: " + combatStageModifierData.combatStageTotal);

    totalRawDamage += combatStageModifierData.combatStageTotal;
    
    for (let i = 0; i < combatStageModifierData.combatStageRollList.length; i ++) {
        temp = combatStageModifierData.combatStageRollList[i];
        rollValueList.push(temp);
    }


    //Type Resistance
    let totalResistanceValue = calculateTypeResistance();
    totalRawDamage += totalResistanceValue;



    //Critical Hit
    let criticalDamageData = calculateCriticalDamage();
    totalRawDamage += criticalDamageData.criticalDamage;




    //Dice Strings
    let diceString = "";
    console.log(diceCollection[0].dieType);
    for (let i = 0; i < diceCollection.length; i++) {
        diceString = diceString.concat(diceCollection[i].dieType);
        if (i + 1 != diceCollection.length) {
            diceString = diceString.concat(" + ");
        }
    }

    for (let i = 0; i < combatStageModifierData.combatStageDice.length; i++) {
        if (combatStageModifierData.combatStageTotal < 0) {
            diceString += " - ";
        } else {
            diceString += " + ";
        }
        diceString = diceString.concat(combatStageModifierData.combatStageDice[i].dieType);
    }

    diceString += " + " + moveData.basePower;
    if (moveData.stabDamage > 0) {
        diceString += " + " + moveData.stabDamage;
    }

    if (totalResistanceValue < 0) {
        diceString += " - " + Math.abs(totalResistanceValue);
    } else if (totalResistanceValue > 0) {
        diceString += " + " + totalResistanceValue;
    }



    let damageRange = calculateDamageRange(diceCollection, combatStageModifierData, totalResistanceValue, criticalDamageData);
    
    console.log(damageRange)

    let rawDamageData = {
        totalRawDamage: totalRawDamage,
        diceString: diceString,
        rollValueList: rollValueList,
        damageRange: damageRange
    }
    return rawDamageData;
}

function calculateDefense() {
    let baseDefRank = parseInt(document.getElementById("baseRankDef").value);
    let addedDefRank = parseInt(document.getElementById("addedRankDef").value);
    let combatStageDef = parseInt(document.getElementById("combatStageDef").value);
    let baseSpDefRank = parseInt(document.getElementById("baseRankSpDef").value);
    let addedSpDefRank = parseInt(document.getElementById("addedRankSpDef").value);
    let combatStageSpDef = parseInt(document.getElementById("combatStageSpDef").value);

    console.log("total defense:");
    console.log(baseDefRank + addedDefRank);
    console.log("total sp defense:");
    console.log(baseSpDefRank + addedSpDefRank);

    let combatStageAverageDef = 0;
    if (combatStageDef != 0) {
        combatStageAverageDef = getCombatStageAverage(Math.abs(combatStageDef));
        if (combatStageDef < 0) {
            combatStageAverageDef = combatStageAverageDef*-1;
        }
    }

    let combatStageAverageSpDef = 0;
    if (combatStageSpDef != 0) {
        combatStageAverageSpDef = getCombatStageAverage(Math.abs(combatStageSpDef));
        if (combatStageSpDef < 0) {
            combatStageAverageSpDef = combatStageAverageSpDef*-1;
        }
    }

    console.log("def combat stage");
    console.log(combatStageAverageDef);
    console.log("sp def combat stage");
    console.log(combatStageAverageSpDef);


    let totalDefenses = {
        totalDefense: ((baseDefRank + addedDefRank) * 2) + combatStageAverageDef,
        totalSpDefense: ((baseSpDefRank + addedSpDefRank) * 2) + combatStageAverageSpDef
    }

    return totalDefenses;
}

function calculateEffectiveDamage() {
    let rawDamageData = calculateRawDamage();
    let totalDefenses = calculateDefense();
    let effectiveDamage;
    let effectiveRelevantDefense;

    let damageType = document.getElementById("damageType").value;
    if (damageType == "physical") {
        effectiveDamage = rawDamageData.totalRawDamage - totalDefenses.totalDefense;
        effectiveRelevantDefense = "Effective Defense: " + totalDefenses.totalDefense;
    } else if (damageType == "special") {
        effectiveDamage = rawDamageData.totalRawDamage - totalDefenses.totalSpDefense;
        effectiveRelevantDefense = "Effective Special Defense: " + totalDefenses.totalSpDefense;
    }

    //if effective damage <0, do shit


    document.getElementById("displayResult").innerHTML = 
    `<table>
    <tr>
        <td>
            Dice: ` + rawDamageData.diceString +
        `</td>
        <td>
            Total Raw Damage: ` + rawDamageData.totalRawDamage +
        `</td>
    </tr>
    <tr>
        <td>
            Actual Rolls: ` + rawDamageData.rollValueList + 
        `</td>
        <td>
            Raw Damage Range: ` + rawDamageData.damageRange.minDamage + ` - ` + rawDamageData.damageRange.maxDamage + `
        </td>
    </tr>
    <tr>
        <td>
            ` + effectiveRelevantDefense + `
        </td>
    </tr>
    <tr>
        <td>
            Effective Damage: ` + effectiveDamage + `
        <td>
    </tr>
    </table>`;



}

function calculateDamageRange(diceCollection, combatStageModifierData, totalResistanceValue, criticalDamageData) {
    //1*number of die in array for min damage possible
    //add maxRoll for highest damage possible

    let moveData = moveStats();

    let minimum = diceCollection.length;
    let maximum = 0;
    for (let i = 0; i < diceCollection.length; i++) {
        maximum += diceCollection[i].maxRoll;
    }

    //add or subtract to min and max damage
    for (let i = 0; i < combatStageModifierData.combatStageDice.length; i++) {
        if (combatStageModifierData.combatStageTotal < 0) {
            maximum--;
            minimum -= combatStageModifierData.combatStageDice[i].maxRoll;
        } else {
            maximum += combatStageModifierData.combatStageDice[i].maxRoll;
            minimum++;
        }
    }

    //temporary?
    //add bp and stab to min and max
    minimum += moveData.basePower;
    maximum += moveData.basePower;
    minimum += moveData.stabDamage;
    maximum += moveData.stabDamage;


    //type resistance
    minimum += totalResistanceValue;
    maximum += totalResistanceValue;


    //critical
    


    let damageRange = {
        minDamage: minimum,
        maxDamage: maximum
    }

    return damageRange;
}



function moveStats() {
    //AC in here maybe
    let basePower = parseInt(document.getElementById("basePower").value);
    let stabDamage = 2;
    let stabCheck = document.getElementById("stabCheck").checked;
    if (!stabCheck) {
        stabDamage = 0;
    }
    let damageType = document.getElementById("damageType").value;
    let typeResistance = parseInt(document.getElementById("typeResistance").value);
    let isCritical = document.getElementById("criticalCheck").checked;
    console.log(isCritical);
    let moveData = {
        basePower: basePower,
        stabDamage: stabDamage,
        damageType: damageType,
        typeResistance: typeResistance,
        isCritical: isCritical
    }
    
    console.log(moveData);
    return moveData;
}

function chooseDamageType() {
    let relevantAttackDice;
    let moveData = moveStats();

    if (moveData.damageType == "physical") {
        relevantAttackDice = createBaseStatDie(parseInt(document.getElementById("baseRankAtk").value)).concat(createAddedStatDie(parseInt(document.getElementById("addedRankAtk").value)));
        //relevantAttackBaseDice = createBaseStatDie(parseInt(document.getElementById("baseRankAtk").value));
        //relevantAttackAddedDice = createAddedStatDie(parseInt(document.getElementById("addedRankAtk").value));
    } else if (moveData.damageType == "special") {
        relevantAttackDice = createBaseStatDie(parseInt(document.getElementById("baseRankSpAtk").value)).concat(createAddedStatDie(parseInt(document.getElementById("addedRankSpAtk").value)));
        //relevantAttackBaseDice = createBaseStatDie(parseInt(document.getElementById("baseRankSpAtk").value));
        //relevantAttackAddedDice = createAddedStatDie(parseInt(document.getElementById("addedRankSpAtk").value));
    }

    //relevantAttackDice.relevantAttackBaseDice = relevantAttackBaseDice;
    //relevantAttackDice.relevantAttackAddedDice = relevantAttackAddedDice;
    console.log(relevantAttackDice);
    return relevantAttackDice;
}

function getRelevantAttackCombatStage() {
    let relevantAttackCombatStage = 0;
    let moveData = moveStats();

    if (moveData.damageType == "physical") {
        relevantAttackCombatStage = parseInt(document.getElementById("combatStageAtk").value);
        console.log("Doing Physical damage");
    }
     else if (moveData.damageType == "special") {
        relevantAttackCombatStage = parseInt(document.getElementById("combatStageSpAtk").value);
        console.log("Doing Special damage");
    }
    console.log("tesing combat modifier rank number1: ");
    console.log(relevantAttackCombatStage);
    return relevantAttackCombatStage;
}


function calculateCombatStageModifier() {
    let relevantAttackCombatStage = getRelevantAttackCombatStage();
    console.log("tesing combat modifier rank number2: ");
    console.log(relevantAttackCombatStage);
    let combatStageDice = createCombatStageDie(Math.abs(relevantAttackCombatStage));
    let combatStageTotal = 0;
    let combatStageRollList = [];

    if (relevantAttackCombatStage != 0) {
        let temp;
        if (relevantAttackCombatStage < 0) {
            for (let i = 0; i < combatStageDice.length; i++) {
                temp = rollDie(combatStageDice[i].maxRoll);
                console.log("CS Roll Value: -" + temp)
                combatStageRollList.push(temp);
                combatStageTotal -= temp;
            }
        } else {
            for (let i = 0; i < combatStageDice.length; i++) {
                temp = rollDie(combatStageDice[i].maxRoll);
                console.log("CS Roll Value: " + temp)
                combatStageRollList.push(temp);
                combatStageTotal += temp;
            }
        }
    }
    //console.log("damage after combat stage: " + totalRawDamage);
    let combatModifierData = {
        combatStageTotal: combatStageTotal,
        combatStageRollList: combatStageRollList,
        combatStageDice: combatStageDice
    };

    return combatModifierData;
}

function calculateCriticalDamage() {
    //temporary
    let criticalDamageData = {};
    let criticalDamage = 0;
    let criticalRolls = [];
    let moveData = moveStats();
    let criticalAddedDice = [];

    if (moveData.isCritical) {
        if (moveData.damageType == "physical") {
            criticalAddedDice = createAddedStatDie(parseInt(document.getElementById("addedRankAtk").value));
        } else if (moveData.damageType == "special") {
            criticalAddedDice = createAddedStatDie(parseInt(document.getElementById("addedRankSpAtk").value));
        }

        for (let i = 0; i < criticalAddedDice.length; i++)  {
            let temp = rollDie(criticalAddedDice[i].maxRoll);
            console.log("Critical Roll Value: " + temp)
            criticalRolls.push(temp);
            criticalDamage += temp;
        }
    
        console.log("before divide by 2: " + criticalDamage);
        criticalDamage = Math.ceil(criticalDamage / 2);
        console.log("after: " + criticalDamage);    
    }

    criticalDamageData = {
        criticalDamage: criticalDamage,
        criticalRolls: criticalRolls,
        criticalDice: criticalAddedDice
    }
    
    console.log(criticalDamageData);
    return criticalDamageData;
}

function calculateTypeResistance() {
    let moveData = moveStats();

    let resistanceValue = 5;
    let totalResistanceValue = 0;

    totalResistanceValue = moveData.typeResistance * resistanceValue;

    return totalResistanceValue;
}


function printResults() {
    
}
