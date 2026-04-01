import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/21
 * 
 * 
 * https://www.reddit.com/r/adventofcode/comments/zrav4h/2022_day_21_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day21/day_21__Monkey_Math.js
 * 
 * Day21 - Monkey Math
 * 
 * root: pppw + sjmn
 * dbpl: 5
 * cczh: sllz + lgvd
 * zczc: 2
 * ptdq: humn - dvpt
 * dvpt: 3
 * lfqf: 4
 * humn: 5
 * ljgn: 2
 * sjmn: drzm * dbpl
 * sllz: 4
 * pppw: cczh / lfqf
 * lgvd: ljgn * ptdq
 * drzm: hmdt - zczc
 * hmdt: 32
 * 
 * Start Calculation
 * ptdq - humn (    5) dvpt (    3) = 2
 * lgvd * ljgn (    2) ptdq (    2) = 4
 * cczh + sllz (    4) lgvd (    4) = 8
 * pppw / cczh (    8) lfqf (    4) = 2
 * drzm - hmdt (   32) zczc (    2) = 30
 * sjmn * drzm (   30) dbpl (    5) = 150
 * root + pppw (    2) sjmn (  150) = 152
 * 
 * End Values
 * 
 * dbpl N  (    0)  (    0) = 5
 * zczc N  (    0)  (    0) = 2
 * dvpt N  (    0)  (    0) = 3
 * lfqf N  (    0)  (    0) = 4
 * humn N  (    0)  (    0) = 5
 * ljgn N  (    0)  (    0) = 2
 * sllz N  (    0)  (    0) = 4
 * hmdt N  (    0)  (    0) = 32
 * root + pppw (    2) sjmn (  150) = 152
 * cczh + sllz (    4) lgvd (    4) = 8
 * ptdq - humn (    5) dvpt (    3) = 2
 * sjmn * drzm (   30) dbpl (    5) = 150
 * pppw / cczh (    8) lfqf (    4) = 2
 * lgvd * ljgn (    2) ptdq (    2) = 4
 * drzm - hmdt (   32) zczc (    2) = 30
 * 
 * root + pppw (    2) sjmn (  150) = 152
 * 
 * Result Part 1 = 152
 * Result Part 2 = 0
 * 
 * Day 21 - Ende
 * 
 */

const RESULT_NOT_READY : number = Number.MAX_SAFE_INTEGER;

const MATH_SYMBOLS     : string [] = [ "+", "-", "*", "/" ];

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function padL( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function padR( pInput : string | number, pPadRight : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadRight )
    { 
        str_result = str_result + " ";
    }

    return str_result;
}



class Monkey 
{
    name           : string; 

    math_operand   : string;

    math_number    : number;

    monkey_a_name  : string;
    monkey_b_name  : string; 

    monkey_a_value : number;
    monkey_b_value : number; 

    monkey_a_inst  : Monkey | undefined;
    monkey_b_inst  : Monkey | undefined;

    constructor( pInput : string )
    {
        let [ str_monkey_name, str_monkey_instructions ] = pInput.split( ":" );

        let math_symbol_position : number = 0;

        let index_symbol : number = 0;

        while ( index_symbol < MATH_SYMBOLS.length ) 
        {
            math_symbol_position = str_monkey_instructions!.indexOf( MATH_SYMBOLS[ index_symbol ]! );

            if ( math_symbol_position > 0 )
            {
                break;
            }

            index_symbol++;
        }

        if ( math_symbol_position > 0 )
        {
            this.math_operand = MATH_SYMBOLS[ index_symbol ]!;

            let [ monkey_a, monkey_b ] = str_monkey_instructions!.split( this.math_operand )!;

            this.monkey_a_name = monkey_a!.trim();
            this.monkey_b_name = monkey_b!.trim();

            this.math_number = RESULT_NOT_READY;
        }
        else
        {
            this.math_operand = "N";

            this.monkey_a_name = "";
            this.monkey_b_name = "";

            this.math_number = parseInt( str_monkey_instructions! );
        }

        this.monkey_a_value = 0;
        this.monkey_b_value = 0;

        this.name = str_monkey_name!;
    }

    public canCalc() : boolean
    {
        if ( this.isNumber() ) return true;

        return ( ( this.monkey_a_inst!.hasResult() ) && ( this.monkey_b_inst!.hasResult() ) )
    }

    public calcNumber() : boolean
    {
        if ( this.hasResult() ) { return true; }

        if ( ( this.monkey_a_inst!.hasResult() ) && ( this.monkey_b_inst!.hasResult() ) )
        {
            this.monkey_a_value = this.monkey_a_inst!.getNumber();
            this.monkey_b_value = this.monkey_b_inst!.getNumber();
            
            if ( this.math_operand === "+" ) { this.math_number = this.monkey_a_value + this.monkey_b_value; }
            if ( this.math_operand === "*" ) { this.math_number = this.monkey_a_value * this.monkey_b_value; }
            if ( this.math_operand === "-" ) { this.math_number = this.monkey_a_value - this.monkey_b_value; }
            if ( this.math_operand === "/" ) { this.math_number = this.monkey_a_value / this.monkey_b_value; }

            return true;
        }

        return false;
    }

    public setMonkeyA( pMonkey : Monkey ) : void 
    {
        this.monkey_a_inst = pMonkey;
    }

    public setMonkeyB( pMonkey : Monkey ) : void 
    {
        this.monkey_b_inst = pMonkey;
    }

    public completeMonkey( pMonkeyVektor : Monkey[] ) : number 
    {
        if ( this.isNumber() )
        {
            return 2;
        }

        let count_monkey : number = 0;

        for ( const monkey of pMonkeyVektor )
        {
            if ( monkey.isName( this.monkey_a_name ) )
            {
                this.monkey_a_inst = monkey;

                count_monkey++;
            }
            else if ( monkey.isName( this.monkey_b_name ) )
            {
                this.monkey_b_inst = monkey;

                count_monkey++;
            }

            if ( count_monkey == 2 ) 
            {
                break;
            }
        }

        return count_monkey;
    }

    public isNumber() : boolean
    {
        return this.math_operand === "N";
    }

    public isDependend() : boolean
    {
        return this.math_operand !== "N";
    }

    public hasResult() : boolean
    {
        return this.math_number !== RESULT_NOT_READY;
    }

    public getNumber() : number 
    {
        return this.math_number;
    }

    public getMonkeyNameA() : string 
    {
        return this.monkey_a_name;
    }

    public getMonkeyNameB() : string 
    {
        return this.monkey_b_name;
    }

    public isName( pName : string ) : boolean
    {
        return this.name === pName;
    }

    public getName() : string 
    { 
        return this.name;
    }

    public toString() : string 
    { 
        return this.name + " " + this.math_operand + " " + this.monkey_a_name + " (" + padL( this.monkey_a_value, 5 )  + ") " + this.monkey_b_name + " (" + padL( this.monkey_b_value, 5 )  + ") = " + this.math_number;
    }
}

class MonkeyVektor 
{
    vektor_monkey : Monkey[] = [];

    constructor()
    {}

    public add( pNewMonkey : Monkey )
    {
        this.vektor_monkey.push( pNewMonkey );
    }

    public getMonkeyByName( pName : string ) : Monkey | undefined
    {
        for ( const monkey of this.vektor_monkey )
        {
            if ( monkey.isName( pName ) )
            {
                return monkey;
            }
        }

        return undefined;
    }

    public getVector() : Monkey[]
    {
        return this.vektor_monkey;
    }

    public toString() : string 
    {
        let s_erg : string = "";

        for ( const monkey of this.vektor_monkey )
        {
            if ( monkey.isNumber() ) s_erg += "\n" + monkey.toString()!;
        }

        for ( const monkey of this.vektor_monkey )
        {
            if ( monkey.isDependend() ) s_erg += "\n" + monkey.toString()!;
        }

        return s_erg;
    }
}


function calcRec( pMonkeyVektor : MonkeyVektor, pMonkeyName : string, pKnzDebug : boolean ) : number
{
    let cur_monkey : Monkey | undefined = pMonkeyVektor.getMonkeyByName( pMonkeyName );

    if ( cur_monkey === undefined )
    {
        throw new Error( "ERROR - Can't find monkey " + pMonkeyName );
    }

    if ( cur_monkey.canCalc() == false )
    { 
        calcRec( pMonkeyVektor, cur_monkey.getMonkeyNameA(), pKnzDebug );

        calcRec( pMonkeyVektor, cur_monkey.getMonkeyNameB(), pKnzDebug );
    }

    if ( cur_monkey.calcNumber() )
    { 
        if ( pKnzDebug && cur_monkey.isDependend() ) 
        {
            wl( cur_monkey.toString() );
        } 

        return 1;
    }

    return 0;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Parsing the input Array. 
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let monkey_vector : MonkeyVektor = new MonkeyVektor();
    
    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str !== "" )
        {
            if ( pKnzDebug )
            {
                wl( cur_input_str );
            }

            monkey_vector.add( new Monkey( cur_input_str ) );
        }
    }

    /*
     * *******************************************************************************************************
     * Completion of the monkey-instance with the dependent instances
     * *******************************************************************************************************
     */

    for ( const monkey of monkey_vector.getVector() )
    {
        if ( monkey.completeMonkey( monkey_vector.getVector() ) !== 2 ) 
        {
            wl( "ERROR - " +  monkey.toString() )

            throw new Error( "ERROR - Complete Monkey");
        }   
    }

    /*
     * *******************************************************************************************************
     * Recursive calculation beginning with the root monkey
     * *******************************************************************************************************
     */
    if ( pKnzDebug )
    {
        wl( "" );
        wl( "Start Calculation " );
    } 

    calcRec( monkey_vector, "root", pKnzDebug );

    if ( pKnzDebug )
    {
        wl( "" );
        wl( "End Values" );
        wl( monkey_vector.toString() );
    } 

    /*
     * *******************************************************************************************************
     * Getting the root monkey and Calculating Results
     * *******************************************************************************************************
     */
    let root_monkey : Monkey | undefined = monkey_vector.getMonkeyByName( "root" );

    wl( "" );
    wl( root_monkey!.toString() );
    wl( "" );

    result_part_01 = root_monkey!.getNumber();

    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day21_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) 
    {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei() : void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "root: pppw + sjmn" );
    array_test.push( "dbpl: 5" );
    array_test.push( "cczh: sllz + lgvd" );
    array_test.push( "zczc: 2" );
    array_test.push( "ptdq: humn - dvpt" );
    array_test.push( "dvpt: 3" );
    array_test.push( "lfqf: 4" );
    array_test.push( "humn: 5" );
    array_test.push( "ljgn: 2" );
    array_test.push( "sjmn: drzm * dbpl" );
    array_test.push( "sllz: 4" );
    array_test.push( "pppw: cczh / lfqf" );
    array_test.push( "lgvd: ljgn * ptdq" );
    array_test.push( "drzm: hmdt - zczc" );
    array_test.push( "hmdt: 32" );


    return array_test;
}

wl( "" );
wl( "Day21 - Monkey Math" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 21 - Ende" );

/*
 * 
 */
