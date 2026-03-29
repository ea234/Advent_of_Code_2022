import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/11
 * 
 * https://www.reddit.com/r/adventofcode/comments/zifqmh/2022_day_11_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Monkey_in_the_Middle.js
 * 
 * Day 11 - Monkey in the Middle
 * 
 * 0 -> Monkey 0: Items 2 79, 98,  OP * 19 Test 23  T 2 F 3
 * 1 -> Monkey 1: Items 4 54, 65, 75, 74,  OP + 6 Test 19  T 2 F 0
 * 2 -> Monkey 2: Items 3 79, 60, 97,  OP * -1 Test 13  T 1 F 3
 * 3 -> Monkey 3: Items 1 74,  OP + 3 Test 17  T 0 F 1
 * 
 * Result Part 1 = 0
 * Result Part 2 = 0
 * 
 * Day 11 - Ende
 */
const OPERATION_PLUS           : string = "+";
const OPERATION_MULTIPLICATION : string = "*";


function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function pad( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while (str_result.length < pPadLeft)
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


class Monkey
{
    monkey_name      : string;

    monkey_nr        : number;

    vector_items     : number[];

    operation_art    : string;
    
    operation_number : number;

    test_number      : number; 

    test_true        : number; 

    test_false       : number; 

    constructor( pArray : string[], pIndexStart : number, pMonkeyNr : number )
    {
        /*
         * Monkey Name (or Index) in row at index_start
         */
        this.monkey_name = pArray[ pIndexStart ]!;

        this.monkey_nr = pMonkeyNr;

        /*
         * Monkey Items in row at index_start + 1
         *
         * Converting to a string vector and then to a number vector.
         */
        let item_string_vector : string[] = pArray[ pIndexStart + 1 ]!.substring( 18 ).split( "," );

        this.vector_items = item_string_vector.map( string_nr => Number( string_nr.trim() ) );

        /*
         * Operation in row at index_start + 2
         *
         * Trying to find the 2 operators "+" and "*".
         * There can only by one operator found. 
         * The found operator is stored.
         * 
         */
        let pos_plus = pArray[ pIndexStart + 2 ]!.indexOf( OPERATION_PLUS           );
        let pos_mult = pArray[ pIndexStart + 2 ]!.indexOf( OPERATION_MULTIPLICATION );

        this.operation_art = OPERATION_PLUS;

        let index_temp : number = pos_plus;

        if ( pos_mult > 0 )
        {
            this.operation_art = OPERATION_MULTIPLICATION;

            index_temp = pos_mult;
        }

        let str_temp : string = pArray[ pIndexStart + 2 ]!.substring( index_temp + 1 ).trim();

        if ( str_temp === "old" )
        {
            this.operation_number = -1;
        }
        else
        {
            this.operation_number = parseInt( str_temp );
        }

        /*
         * Test-Method in row at index_start + 3
         *
         * The test is always "divisible by <number>"
         */
        str_temp = pArray[ pIndexStart + 3 ]!.substring( 21 ).trim();

        this.test_number = parseInt( str_temp );

        /*
         * True-Part in row at index_start + 4
         */
        str_temp = pArray[ pIndexStart + 4 ]!.substring( 29 ).trim();

        this.test_true = parseInt( str_temp );

        /*
         * False-Part in row at index_start + 5
         */
        str_temp = pArray[ pIndexStart + 5 ]!.substring( 30 ).trim();

        this.test_false = parseInt( str_temp );
    }

    private doCalc( pOldValue : number ) : number
    {
        let op_value : number = this.operation_number == -1 ? pOldValue : this.operation_number;

        let new_value : number = -1;

        if ( this.operation_art === OPERATION_PLUS )
        {
            new_value = pOldValue + op_value;
        }
        else if ( this.operation_art === OPERATION_MULTIPLICATION )
        {
            new_value = pOldValue * op_value;
        }

        return new_value;
    }

    private doTest( pValue : number ) : boolean
    {
        if ( ( pValue % this.test_number ) === 0 ) 
        { 
            return true;
        }

        return false;
    }

    public calcItemNr( pOldValue : number ) : { new_value : number, throw_to_monkey : number } 
    {
        let new_value : number = this.doCalc( pOldValue );

        let divisible : boolean = this.doTest( new_value );

        let throw_to_monkey : number = divisible ? this.test_true : this.test_false;

        return { new_value : new_value, throw_to_monkey : throw_to_monkey }
    }

    public popItem() : number
    {
        return this.vector_items.splice( 0, 1 )[0]!;
    }

    public pushItem( pNumber : number ) : void 
    {
        this.vector_items.push( pNumber );
    }

    public getItemCount() : number 
    {
        return this.vector_items.length;
    }

    public getItemsString() : string 
    {
        let str_result : string = "";

        for ( const v_item of this.vector_items )
        {
            str_result += v_item + ", ";
        }

        return str_result;
    }

    public toString() 
    {
        return this.monkey_nr + " -> " + this.monkey_name + " Items " + this.getItemCount() + " " + this.getItemsString() + " OP "+ this.operation_art + " " + this.operation_number + " Test " + this.test_number + "  T " + this.test_true + " F " + this.test_false + " ";
    }
}

function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Initializing the Monkey's
     * *******************************************************************************************************
     */

    let monkey_vector : Monkey[] = [];

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let index_monkey_init_start : number = 0;

    let cur_index   : number = 0;

    let monkey_nr : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str === "" )
        {
            monkey_vector.push( new Monkey( pArray, index_monkey_init_start, monkey_nr ) );

            monkey_nr++;

            index_monkey_init_start = cur_index + 1;
        }

        cur_index++;
    }

    monkey_vector.push( new Monkey( pArray, index_monkey_init_start, monkey_nr ) );

    for ( const m_inst of monkey_vector )
    {
        wl( m_inst.toString() );
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 1 and 2
     * *******************************************************************************************************
     */



    /*
     * *******************************************************************************************************
     * Displaying results
     * *******************************************************************************************************
     */

    if ( pKnzDebug )
    {
        wl( "" );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day11_input.txt";

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
    
    array_test.push( "Monkey 0:" );
    array_test.push( "  Starting items: 79, 98" );
    array_test.push( "  Operation: new = old * 19" );
    array_test.push( "  Test: divisible by 23" );
    array_test.push( "    If true: throw to monkey 2" );
    array_test.push( "    If false: throw to monkey 3" );
    array_test.push( "" );
    array_test.push( "Monkey 1:" );
    array_test.push( "  Starting items: 54, 65, 75, 74" );
    array_test.push( "  Operation: new = old + 6" );
    array_test.push( "  Test: divisible by 19" );
    array_test.push( "    If true: throw to monkey 2" );
    array_test.push( "    If false: throw to monkey 0" );
    array_test.push( "" );
    array_test.push( "Monkey 2:" );
    array_test.push( "  Starting items: 79, 60, 97" );
    array_test.push( "  Operation: new = old * old" );
    array_test.push( "  Test: divisible by 13" );
    array_test.push( "    If true: throw to monkey 1" );
    array_test.push( "    If false: throw to monkey 3" );
    array_test.push( "" );
    array_test.push( "Monkey 3:" );
    array_test.push( "  Starting items: 74" );
    array_test.push( "  Operation: new = old + 3" );
    array_test.push( "  Test: divisible by 17" );
    array_test.push( "    If true: throw to monkey 0" );
    array_test.push( "    If false: throw to monkey 1" );

    return array_test;
}

wl( "" )
wl( "Day 11 - Monkey in the Middle" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 11 - Ende" );
