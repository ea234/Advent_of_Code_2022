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
 * 
 * Monkey 0     101  Items   5  10, 12, 14, 26, 34,
 * Monkey 1      95  Items   5  245, 93, 53, 199, 115,
 * Monkey 2       7  Items   0
 * Monkey 3     105  Items   0
 * 
 * (4) [105, 101, 95, 7]
 * 
 * Monkey Business = 105 * 101 = 10605
 * 
 * Result Part 1 = 10605
 * Result Part 2 = 0
 * 
 * Day 11 - Ende
 */
const OPERATION_PLUS           : string = "+";
const OPERATION_MULTIPLICATION : string = "*";

type InspectionResult = { new_value : number, relief_value : number, throw_to_monkey : number, dbg_string : string };


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

    items_inspected  : number = 0;

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

    public calcItemNr( pOldValue : number, pReliefDivider : number, pKnzDebug : boolean ) : InspectionResult
    {
        this.items_inspected++;

        let new_value : number = this.doCalc( pOldValue );

        let relief_value : number = Math.floor( new_value / pReliefDivider );

        let divisible : boolean = this.doTest( relief_value );

        let throw_to_monkey : number = divisible ? this.test_true : this.test_false;

        let dbg_string : string = "";

        if ( pKnzDebug )
        {
            let pad_count = 6;

            dbg_string = "Monkey " + this.monkey_nr + ": " + pad( this.items_inspected, pad_count ) + " -> Old " + pad( pOldValue, pad_count ) + "  New Value " + pad( new_value, pad_count ) + "  Relief " + pad( relief_value, pad_count ) + "  Div " + pad( this.test_number, 2 ) + " " + pad( "" + divisible, 5 ) + "  Throwing To " + throw_to_monkey;
        }

        return { new_value : new_value, relief_value : relief_value, throw_to_monkey : throw_to_monkey, dbg_string : dbg_string }
    }

    public popItem() : number
    {
        return this.vector_items.splice( 0, 1 )[0]!;
    }

    public pushItem( pNumber : number ) : void 
    {
        this.vector_items.push( pNumber );
    }

    public getItemsInspected() : number 
    {
        return this.items_inspected;
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

    public isMonkeyNr( pNr : number ) : boolean
    {
        return this.monkey_nr == pNr;
    }

    public toStringDbg() 
    {
        return "Monkey " + this.monkey_nr + " " + pad( this.items_inspected, 7 ) + "  Items " + pad( this.getItemCount(), 3 ) + "  " + this.getItemsString();
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
     * Helpfunction to get a specific monkey
     * *******************************************************************************************************
     */

    const getMonkeyNr = ( pMonkeyNr : number ) : Monkey | undefined => {
         
            for ( const m_inst of monkey_vector )
            {
                if ( m_inst.isMonkeyNr( pMonkeyNr ) )
                {
                    return m_inst;
                }
            }
        
            return undefined;   
        }

    /*
     * *******************************************************************************************************
     * Playing rounds
     * *******************************************************************************************************
     */

    let rounds_to_play : number = 20;
    let round_nr       : number =  0;

    while ( round_nr < rounds_to_play  )
    {
        if ( pKnzDebug )
        {
            wl( "" );
            wl( "Round " + ( round_nr + 1 ) );
        }

        for ( const m_inst of monkey_vector )
        {
            while( m_inst.getItemCount() > 0 )
            {
                let old_value : number = m_inst.popItem();

                let res_inspec : InspectionResult = m_inst.calcItemNr( old_value, 3, pKnzDebug );
                
                if ( pKnzDebug )
                {
                    wl( res_inspec.dbg_string );
                }

                let receiver_monkey = getMonkeyNr( res_inspec.throw_to_monkey );

                if ( receiver_monkey !== undefined )
                {
                    receiver_monkey.pushItem( res_inspec.relief_value );
                }
                else
                {
                    wl( "ERROR - Monkey " + res_inspec.throw_to_monkey + " not found" );
                }
            }
        }

        round_nr++;
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 1 - Monkey Businiss
     * *******************************************************************************************************
     */
    let vector_inspected_items : number[] = [];

    wl( "" );

    for ( const m_inst of monkey_vector )
    {
        wl( m_inst.toStringDbg() );

        vector_inspected_items.push( m_inst.getItemsInspected() );
    }

    vector_inspected_items.sort( ( a, b ) => b - a );

    wl( "" );

    console.log( vector_inspected_items );

    result_part_01 = vector_inspected_items[ 0 ]! * vector_inspected_items[ 1 ]!;

    wl( "" );
    wl( "Monkey Business = " + vector_inspected_items[ 0 ]! + " * " + vector_inspected_items[ 1 ]! + " = " + result_part_01 + " " );

    /*
     * *******************************************************************************************************
     * Displaying results
     * *******************************************************************************************************
     */

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

/*
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
 * Round 1
 * Monkey 0:      1 -> Old     79  New Value   1501  Relief    500  Div 23 false  Throwing To 3
 * Monkey 0:      2 -> Old     98  New Value   1862  Relief    620  Div 23 false  Throwing To 3
 * Monkey 1:      1 -> Old     54  New Value     60  Relief     20  Div 19 false  Throwing To 0
 * Monkey 1:      2 -> Old     65  New Value     71  Relief     23  Div 19 false  Throwing To 0
 * Monkey 1:      3 -> Old     75  New Value     81  Relief     27  Div 19 false  Throwing To 0
 * Monkey 1:      4 -> Old     74  New Value     80  Relief     26  Div 19 false  Throwing To 0
 * Monkey 2:      1 -> Old     79  New Value   6241  Relief   2080  Div 13  true  Throwing To 1
 * Monkey 2:      2 -> Old     60  New Value   3600  Relief   1200  Div 13 false  Throwing To 3
 * Monkey 2:      3 -> Old     97  New Value   9409  Relief   3136  Div 13 false  Throwing To 3
 * Monkey 3:      1 -> Old     74  New Value     77  Relief     25  Div 17 false  Throwing To 1
 * Monkey 3:      2 -> Old    500  New Value    503  Relief    167  Div 17 false  Throwing To 1
 * Monkey 3:      3 -> Old    620  New Value    623  Relief    207  Div 17 false  Throwing To 1
 * Monkey 3:      4 -> Old   1200  New Value   1203  Relief    401  Div 17 false  Throwing To 1
 * Monkey 3:      5 -> Old   3136  New Value   3139  Relief   1046  Div 17 false  Throwing To 1
 * 
 * Round 2
 * Monkey 0:      3 -> Old     20  New Value    380  Relief    126  Div 23 false  Throwing To 3
 * Monkey 0:      4 -> Old     23  New Value    437  Relief    145  Div 23 false  Throwing To 3
 * Monkey 0:      5 -> Old     27  New Value    513  Relief    171  Div 23 false  Throwing To 3
 * Monkey 0:      6 -> Old     26  New Value    494  Relief    164  Div 23 false  Throwing To 3
 * Monkey 1:      5 -> Old   2080  New Value   2086  Relief    695  Div 19 false  Throwing To 0
 * Monkey 1:      6 -> Old     25  New Value     31  Relief     10  Div 19 false  Throwing To 0
 * Monkey 1:      7 -> Old    167  New Value    173  Relief     57  Div 19  true  Throwing To 2
 * Monkey 1:      8 -> Old    207  New Value    213  Relief     71  Div 19 false  Throwing To 0
 * Monkey 1:      9 -> Old    401  New Value    407  Relief    135  Div 19 false  Throwing To 0
 * Monkey 1:     10 -> Old   1046  New Value   1052  Relief    350  Div 19 false  Throwing To 0
 * Monkey 2:      4 -> Old     57  New Value   3249  Relief   1083  Div 13 false  Throwing To 3
 * Monkey 3:      6 -> Old    126  New Value    129  Relief     43  Div 17 false  Throwing To 1
 * Monkey 3:      7 -> Old    145  New Value    148  Relief     49  Div 17 false  Throwing To 1
 * Monkey 3:      8 -> Old    171  New Value    174  Relief     58  Div 17 false  Throwing To 1
 * Monkey 3:      9 -> Old    164  New Value    167  Relief     55  Div 17 false  Throwing To 1
 * Monkey 3:     10 -> Old   1083  New Value   1086  Relief    362  Div 17 false  Throwing To 1
 * 
 * Round 3
 * Monkey 0:      7 -> Old    695  New Value  13205  Relief   4401  Div 23 false  Throwing To 3
 * Monkey 0:      8 -> Old     10  New Value    190  Relief     63  Div 23 false  Throwing To 3
 * Monkey 0:      9 -> Old     71  New Value   1349  Relief    449  Div 23 false  Throwing To 3
 * Monkey 0:     10 -> Old    135  New Value   2565  Relief    855  Div 23 false  Throwing To 3
 * Monkey 0:     11 -> Old    350  New Value   6650  Relief   2216  Div 23 false  Throwing To 3
 * Monkey 1:     11 -> Old     43  New Value     49  Relief     16  Div 19 false  Throwing To 0
 * Monkey 1:     12 -> Old     49  New Value     55  Relief     18  Div 19 false  Throwing To 0
 * Monkey 1:     13 -> Old     58  New Value     64  Relief     21  Div 19 false  Throwing To 0
 * Monkey 1:     14 -> Old     55  New Value     61  Relief     20  Div 19 false  Throwing To 0
 * Monkey 1:     15 -> Old    362  New Value    368  Relief    122  Div 19 false  Throwing To 0
 * Monkey 3:     11 -> Old   4401  New Value   4404  Relief   1468  Div 17 false  Throwing To 1
 * Monkey 3:     12 -> Old     63  New Value     66  Relief     22  Div 17 false  Throwing To 1
 * Monkey 3:     13 -> Old    449  New Value    452  Relief    150  Div 17 false  Throwing To 1
 * Monkey 3:     14 -> Old    855  New Value    858  Relief    286  Div 17 false  Throwing To 1
 * Monkey 3:     15 -> Old   2216  New Value   2219  Relief    739  Div 17 false  Throwing To 1
 * 
 * Round 4
 * Monkey 0:     12 -> Old     16  New Value    304  Relief    101  Div 23 false  Throwing To 3
 * Monkey 0:     13 -> Old     18  New Value    342  Relief    114  Div 23 false  Throwing To 3
 * Monkey 0:     14 -> Old     21  New Value    399  Relief    133  Div 23 false  Throwing To 3
 * Monkey 0:     15 -> Old     20  New Value    380  Relief    126  Div 23 false  Throwing To 3
 * Monkey 0:     16 -> Old    122  New Value   2318  Relief    772  Div 23 false  Throwing To 3
 * Monkey 1:     16 -> Old   1468  New Value   1474  Relief    491  Div 19 false  Throwing To 0
 * Monkey 1:     17 -> Old     22  New Value     28  Relief      9  Div 19 false  Throwing To 0
 * Monkey 1:     18 -> Old    150  New Value    156  Relief     52  Div 19 false  Throwing To 0
 * Monkey 1:     19 -> Old    286  New Value    292  Relief     97  Div 19 false  Throwing To 0
 * Monkey 1:     20 -> Old    739  New Value    745  Relief    248  Div 19 false  Throwing To 0
 * Monkey 3:     16 -> Old    101  New Value    104  Relief     34  Div 17  true  Throwing To 0
 * Monkey 3:     17 -> Old    114  New Value    117  Relief     39  Div 17 false  Throwing To 1
 * Monkey 3:     18 -> Old    133  New Value    136  Relief     45  Div 17 false  Throwing To 1
 * Monkey 3:     19 -> Old    126  New Value    129  Relief     43  Div 17 false  Throwing To 1
 * Monkey 3:     20 -> Old    772  New Value    775  Relief    258  Div 17 false  Throwing To 1
 * 
 * Round 5
 * Monkey 0:     17 -> Old    491  New Value   9329  Relief   3109  Div 23 false  Throwing To 3
 * Monkey 0:     18 -> Old      9  New Value    171  Relief     57  Div 23 false  Throwing To 3
 * Monkey 0:     19 -> Old     52  New Value    988  Relief    329  Div 23 false  Throwing To 3
 * Monkey 0:     20 -> Old     97  New Value   1843  Relief    614  Div 23 false  Throwing To 3
 * Monkey 0:     21 -> Old    248  New Value   4712  Relief   1570  Div 23 false  Throwing To 3
 * Monkey 0:     22 -> Old     34  New Value    646  Relief    215  Div 23 false  Throwing To 3
 * Monkey 1:     21 -> Old     39  New Value     45  Relief     15  Div 19 false  Throwing To 0
 * Monkey 1:     22 -> Old     45  New Value     51  Relief     17  Div 19 false  Throwing To 0
 * Monkey 1:     23 -> Old     43  New Value     49  Relief     16  Div 19 false  Throwing To 0
 * Monkey 1:     24 -> Old    258  New Value    264  Relief     88  Div 19 false  Throwing To 0
 * Monkey 3:     21 -> Old   3109  New Value   3112  Relief   1037  Div 17  true  Throwing To 0
 * Monkey 3:     22 -> Old     57  New Value     60  Relief     20  Div 17 false  Throwing To 1
 * Monkey 3:     23 -> Old    329  New Value    332  Relief    110  Div 17 false  Throwing To 1
 * Monkey 3:     24 -> Old    614  New Value    617  Relief    205  Div 17 false  Throwing To 1
 * Monkey 3:     25 -> Old   1570  New Value   1573  Relief    524  Div 17 false  Throwing To 1
 * Monkey 3:     26 -> Old    215  New Value    218  Relief     72  Div 17 false  Throwing To 1
 * 
 * Round 6
 * Monkey 0:     23 -> Old     15  New Value    285  Relief     95  Div 23 false  Throwing To 3
 * Monkey 0:     24 -> Old     17  New Value    323  Relief    107  Div 23 false  Throwing To 3
 * Monkey 0:     25 -> Old     16  New Value    304  Relief    101  Div 23 false  Throwing To 3
 * Monkey 0:     26 -> Old     88  New Value   1672  Relief    557  Div 23 false  Throwing To 3
 * Monkey 0:     27 -> Old   1037  New Value  19703  Relief   6567  Div 23 false  Throwing To 3
 * Monkey 1:     25 -> Old     20  New Value     26  Relief      8  Div 19 false  Throwing To 0
 * Monkey 1:     26 -> Old    110  New Value    116  Relief     38  Div 19  true  Throwing To 2
 * Monkey 1:     27 -> Old    205  New Value    211  Relief     70  Div 19 false  Throwing To 0
 * Monkey 1:     28 -> Old    524  New Value    530  Relief    176  Div 19 false  Throwing To 0
 * Monkey 1:     29 -> Old     72  New Value     78  Relief     26  Div 19 false  Throwing To 0
 * Monkey 2:      5 -> Old     38  New Value   1444  Relief    481  Div 13  true  Throwing To 1
 * Monkey 3:     27 -> Old     95  New Value     98  Relief     32  Div 17 false  Throwing To 1
 * Monkey 3:     28 -> Old    107  New Value    110  Relief     36  Div 17 false  Throwing To 1
 * Monkey 3:     29 -> Old    101  New Value    104  Relief     34  Div 17  true  Throwing To 0
 * Monkey 3:     30 -> Old    557  New Value    560  Relief    186  Div 17 false  Throwing To 1
 * Monkey 3:     31 -> Old   6567  New Value   6570  Relief   2190  Div 17 false  Throwing To 1
 * 
 * Round 7
 * Monkey 0:     28 -> Old      8  New Value    152  Relief     50  Div 23 false  Throwing To 3
 * Monkey 0:     29 -> Old     70  New Value   1330  Relief    443  Div 23 false  Throwing To 3
 * Monkey 0:     30 -> Old    176  New Value   3344  Relief   1114  Div 23 false  Throwing To 3
 * Monkey 0:     31 -> Old     26  New Value    494  Relief    164  Div 23 false  Throwing To 3
 * Monkey 0:     32 -> Old     34  New Value    646  Relief    215  Div 23 false  Throwing To 3
 * Monkey 1:     30 -> Old    481  New Value    487  Relief    162  Div 19 false  Throwing To 0
 * Monkey 1:     31 -> Old     32  New Value     38  Relief     12  Div 19 false  Throwing To 0
 * Monkey 1:     32 -> Old     36  New Value     42  Relief     14  Div 19 false  Throwing To 0
 * Monkey 1:     33 -> Old    186  New Value    192  Relief     64  Div 19 false  Throwing To 0
 * Monkey 1:     34 -> Old   2190  New Value   2196  Relief    732  Div 19 false  Throwing To 0
 * Monkey 3:     32 -> Old     50  New Value     53  Relief     17  Div 17  true  Throwing To 0
 * Monkey 3:     33 -> Old    443  New Value    446  Relief    148  Div 17 false  Throwing To 1
 * Monkey 3:     34 -> Old   1114  New Value   1117  Relief    372  Div 17 false  Throwing To 1
 * Monkey 3:     35 -> Old    164  New Value    167  Relief     55  Div 17 false  Throwing To 1
 * Monkey 3:     36 -> Old    215  New Value    218  Relief     72  Div 17 false  Throwing To 1
 * 
 * Round 8
 * Monkey 0:     33 -> Old    162  New Value   3078  Relief   1026  Div 23 false  Throwing To 3
 * Monkey 0:     34 -> Old     12  New Value    228  Relief     76  Div 23 false  Throwing To 3
 * Monkey 0:     35 -> Old     14  New Value    266  Relief     88  Div 23 false  Throwing To 3
 * Monkey 0:     36 -> Old     64  New Value   1216  Relief    405  Div 23 false  Throwing To 3
 * Monkey 0:     37 -> Old    732  New Value  13908  Relief   4636  Div 23 false  Throwing To 3
 * Monkey 0:     38 -> Old     17  New Value    323  Relief    107  Div 23 false  Throwing To 3
 * Monkey 1:     35 -> Old    148  New Value    154  Relief     51  Div 19 false  Throwing To 0
 * Monkey 1:     36 -> Old    372  New Value    378  Relief    126  Div 19 false  Throwing To 0
 * Monkey 1:     37 -> Old     55  New Value     61  Relief     20  Div 19 false  Throwing To 0
 * Monkey 1:     38 -> Old     72  New Value     78  Relief     26  Div 19 false  Throwing To 0
 * Monkey 3:     37 -> Old   1026  New Value   1029  Relief    343  Div 17 false  Throwing To 1
 * Monkey 3:     38 -> Old     76  New Value     79  Relief     26  Div 17 false  Throwing To 1
 * Monkey 3:     39 -> Old     88  New Value     91  Relief     30  Div 17 false  Throwing To 1
 * Monkey 3:     40 -> Old    405  New Value    408  Relief    136  Div 17  true  Throwing To 0
 * Monkey 3:     41 -> Old   4636  New Value   4639  Relief   1546  Div 17 false  Throwing To 1
 * Monkey 3:     42 -> Old    107  New Value    110  Relief     36  Div 17 false  Throwing To 1
 * 
 * Round 9
 * Monkey 0:     39 -> Old     51  New Value    969  Relief    323  Div 23 false  Throwing To 3
 * Monkey 0:     40 -> Old    126  New Value   2394  Relief    798  Div 23 false  Throwing To 3
 * Monkey 0:     41 -> Old     20  New Value    380  Relief    126  Div 23 false  Throwing To 3
 * Monkey 0:     42 -> Old     26  New Value    494  Relief    164  Div 23 false  Throwing To 3
 * Monkey 0:     43 -> Old    136  New Value   2584  Relief    861  Div 23 false  Throwing To 3
 * Monkey 1:     39 -> Old    343  New Value    349  Relief    116  Div 19 false  Throwing To 0
 * Monkey 1:     40 -> Old     26  New Value     32  Relief     10  Div 19 false  Throwing To 0
 * Monkey 1:     41 -> Old     30  New Value     36  Relief     12  Div 19 false  Throwing To 0
 * Monkey 1:     42 -> Old   1546  New Value   1552  Relief    517  Div 19 false  Throwing To 0
 * Monkey 1:     43 -> Old     36  New Value     42  Relief     14  Div 19 false  Throwing To 0
 * Monkey 3:     43 -> Old    323  New Value    326  Relief    108  Div 17 false  Throwing To 1
 * Monkey 3:     44 -> Old    798  New Value    801  Relief    267  Div 17 false  Throwing To 1
 * Monkey 3:     45 -> Old    126  New Value    129  Relief     43  Div 17 false  Throwing To 1
 * Monkey 3:     46 -> Old    164  New Value    167  Relief     55  Div 17 false  Throwing To 1
 * Monkey 3:     47 -> Old    861  New Value    864  Relief    288  Div 17 false  Throwing To 1
 * 
 * Round 10
 * Monkey 0:     44 -> Old    116  New Value   2204  Relief    734  Div 23 false  Throwing To 3
 * Monkey 0:     45 -> Old     10  New Value    190  Relief     63  Div 23 false  Throwing To 3
 * Monkey 0:     46 -> Old     12  New Value    228  Relief     76  Div 23 false  Throwing To 3
 * Monkey 0:     47 -> Old    517  New Value   9823  Relief   3274  Div 23 false  Throwing To 3
 * Monkey 0:     48 -> Old     14  New Value    266  Relief     88  Div 23 false  Throwing To 3
 * Monkey 1:     44 -> Old    108  New Value    114  Relief     38  Div 19  true  Throwing To 2
 * Monkey 1:     45 -> Old    267  New Value    273  Relief     91  Div 19 false  Throwing To 0
 * Monkey 1:     46 -> Old     43  New Value     49  Relief     16  Div 19 false  Throwing To 0
 * Monkey 1:     47 -> Old     55  New Value     61  Relief     20  Div 19 false  Throwing To 0
 * Monkey 1:     48 -> Old    288  New Value    294  Relief     98  Div 19 false  Throwing To 0
 * Monkey 2:      6 -> Old     38  New Value   1444  Relief    481  Div 13  true  Throwing To 1
 * Monkey 3:     48 -> Old    734  New Value    737  Relief    245  Div 17 false  Throwing To 1
 * Monkey 3:     49 -> Old     63  New Value     66  Relief     22  Div 17 false  Throwing To 1
 * Monkey 3:     50 -> Old     76  New Value     79  Relief     26  Div 17 false  Throwing To 1
 * Monkey 3:     51 -> Old   3274  New Value   3277  Relief   1092  Div 17 false  Throwing To 1
 * Monkey 3:     52 -> Old     88  New Value     91  Relief     30  Div 17 false  Throwing To 1
 * 
 * Round 11
 * Monkey 0:     49 -> Old     91  New Value   1729  Relief    576  Div 23 false  Throwing To 3
 * Monkey 0:     50 -> Old     16  New Value    304  Relief    101  Div 23 false  Throwing To 3
 * Monkey 0:     51 -> Old     20  New Value    380  Relief    126  Div 23 false  Throwing To 3
 * Monkey 0:     52 -> Old     98  New Value   1862  Relief    620  Div 23 false  Throwing To 3
 * Monkey 1:     49 -> Old    481  New Value    487  Relief    162  Div 19 false  Throwing To 0
 * Monkey 1:     50 -> Old    245  New Value    251  Relief     83  Div 19 false  Throwing To 0
 * Monkey 1:     51 -> Old     22  New Value     28  Relief      9  Div 19 false  Throwing To 0
 * Monkey 1:     52 -> Old     26  New Value     32  Relief     10  Div 19 false  Throwing To 0
 * Monkey 1:     53 -> Old   1092  New Value   1098  Relief    366  Div 19 false  Throwing To 0
 * Monkey 1:     54 -> Old     30  New Value     36  Relief     12  Div 19 false  Throwing To 0
 * Monkey 3:     53 -> Old    576  New Value    579  Relief    193  Div 17 false  Throwing To 1
 * Monkey 3:     54 -> Old    101  New Value    104  Relief     34  Div 17  true  Throwing To 0
 * Monkey 3:     55 -> Old    126  New Value    129  Relief     43  Div 17 false  Throwing To 1
 * Monkey 3:     56 -> Old    620  New Value    623  Relief    207  Div 17 false  Throwing To 1
 * 
 * Round 12
 * Monkey 0:     53 -> Old    162  New Value   3078  Relief   1026  Div 23 false  Throwing To 3
 * Monkey 0:     54 -> Old     83  New Value   1577  Relief    525  Div 23 false  Throwing To 3
 * Monkey 0:     55 -> Old      9  New Value    171  Relief     57  Div 23 false  Throwing To 3
 * Monkey 0:     56 -> Old     10  New Value    190  Relief     63  Div 23 false  Throwing To 3
 * Monkey 0:     57 -> Old    366  New Value   6954  Relief   2318  Div 23 false  Throwing To 3
 * Monkey 0:     58 -> Old     12  New Value    228  Relief     76  Div 23 false  Throwing To 3
 * Monkey 0:     59 -> Old     34  New Value    646  Relief    215  Div 23 false  Throwing To 3
 * Monkey 1:     55 -> Old    193  New Value    199  Relief     66  Div 19 false  Throwing To 0
 * Monkey 1:     56 -> Old     43  New Value     49  Relief     16  Div 19 false  Throwing To 0
 * Monkey 1:     57 -> Old    207  New Value    213  Relief     71  Div 19 false  Throwing To 0
 * Monkey 3:     57 -> Old   1026  New Value   1029  Relief    343  Div 17 false  Throwing To 1
 * Monkey 3:     58 -> Old    525  New Value    528  Relief    176  Div 17 false  Throwing To 1
 * Monkey 3:     59 -> Old     57  New Value     60  Relief     20  Div 17 false  Throwing To 1
 * Monkey 3:     60 -> Old     63  New Value     66  Relief     22  Div 17 false  Throwing To 1
 * Monkey 3:     61 -> Old   2318  New Value   2321  Relief    773  Div 17 false  Throwing To 1
 * Monkey 3:     62 -> Old     76  New Value     79  Relief     26  Div 17 false  Throwing To 1
 * Monkey 3:     63 -> Old    215  New Value    218  Relief     72  Div 17 false  Throwing To 1
 * 
 * Round 13
 * Monkey 0:     60 -> Old     66  New Value   1254  Relief    418  Div 23 false  Throwing To 3
 * Monkey 0:     61 -> Old     16  New Value    304  Relief    101  Div 23 false  Throwing To 3
 * Monkey 0:     62 -> Old     71  New Value   1349  Relief    449  Div 23 false  Throwing To 3
 * Monkey 1:     58 -> Old    343  New Value    349  Relief    116  Div 19 false  Throwing To 0
 * Monkey 1:     59 -> Old    176  New Value    182  Relief     60  Div 19 false  Throwing To 0
 * Monkey 1:     60 -> Old     20  New Value     26  Relief      8  Div 19 false  Throwing To 0
 * Monkey 1:     61 -> Old     22  New Value     28  Relief      9  Div 19 false  Throwing To 0
 * Monkey 1:     62 -> Old    773  New Value    779  Relief    259  Div 19 false  Throwing To 0
 * Monkey 1:     63 -> Old     26  New Value     32  Relief     10  Div 19 false  Throwing To 0
 * Monkey 1:     64 -> Old     72  New Value     78  Relief     26  Div 19 false  Throwing To 0
 * Monkey 3:     64 -> Old    418  New Value    421  Relief    140  Div 17 false  Throwing To 1
 * Monkey 3:     65 -> Old    101  New Value    104  Relief     34  Div 17  true  Throwing To 0
 * Monkey 3:     66 -> Old    449  New Value    452  Relief    150  Div 17 false  Throwing To 1
 * 
 * Round 14
 * Monkey 0:     63 -> Old    116  New Value   2204  Relief    734  Div 23 false  Throwing To 3
 * Monkey 0:     64 -> Old     60  New Value   1140  Relief    380  Div 23 false  Throwing To 3
 * Monkey 0:     65 -> Old      8  New Value    152  Relief     50  Div 23 false  Throwing To 3
 * Monkey 0:     66 -> Old      9  New Value    171  Relief     57  Div 23 false  Throwing To 3
 * Monkey 0:     67 -> Old    259  New Value   4921  Relief   1640  Div 23 false  Throwing To 3
 * Monkey 0:     68 -> Old     10  New Value    190  Relief     63  Div 23 false  Throwing To 3
 * Monkey 0:     69 -> Old     26  New Value    494  Relief    164  Div 23 false  Throwing To 3
 * Monkey 0:     70 -> Old     34  New Value    646  Relief    215  Div 23 false  Throwing To 3
 * Monkey 1:     65 -> Old    140  New Value    146  Relief     48  Div 19 false  Throwing To 0
 * Monkey 1:     66 -> Old    150  New Value    156  Relief     52  Div 19 false  Throwing To 0
 * Monkey 3:     67 -> Old    734  New Value    737  Relief    245  Div 17 false  Throwing To 1
 * Monkey 3:     68 -> Old    380  New Value    383  Relief    127  Div 17 false  Throwing To 1
 * Monkey 3:     69 -> Old     50  New Value     53  Relief     17  Div 17  true  Throwing To 0
 * Monkey 3:     70 -> Old     57  New Value     60  Relief     20  Div 17 false  Throwing To 1
 * Monkey 3:     71 -> Old   1640  New Value   1643  Relief    547  Div 17 false  Throwing To 1
 * Monkey 3:     72 -> Old     63  New Value     66  Relief     22  Div 17 false  Throwing To 1
 * Monkey 3:     73 -> Old    164  New Value    167  Relief     55  Div 17 false  Throwing To 1
 * Monkey 3:     74 -> Old    215  New Value    218  Relief     72  Div 17 false  Throwing To 1
 * 
 * Round 15
 * Monkey 0:     71 -> Old     48  New Value    912  Relief    304  Div 23 false  Throwing To 3
 * Monkey 0:     72 -> Old     52  New Value    988  Relief    329  Div 23 false  Throwing To 3
 * Monkey 0:     73 -> Old     17  New Value    323  Relief    107  Div 23 false  Throwing To 3
 * Monkey 1:     67 -> Old    245  New Value    251  Relief     83  Div 19 false  Throwing To 0
 * Monkey 1:     68 -> Old    127  New Value    133  Relief     44  Div 19 false  Throwing To 0
 * Monkey 1:     69 -> Old     20  New Value     26  Relief      8  Div 19 false  Throwing To 0
 * Monkey 1:     70 -> Old    547  New Value    553  Relief    184  Div 19 false  Throwing To 0
 * Monkey 1:     71 -> Old     22  New Value     28  Relief      9  Div 19 false  Throwing To 0
 * Monkey 1:     72 -> Old     55  New Value     61  Relief     20  Div 19 false  Throwing To 0
 * Monkey 1:     73 -> Old     72  New Value     78  Relief     26  Div 19 false  Throwing To 0
 * Monkey 3:     75 -> Old    304  New Value    307  Relief    102  Div 17  true  Throwing To 0
 * Monkey 3:     76 -> Old    329  New Value    332  Relief    110  Div 17 false  Throwing To 1
 * Monkey 3:     77 -> Old    107  New Value    110  Relief     36  Div 17 false  Throwing To 1
 * 
 * Round 16
 * Monkey 0:     74 -> Old     83  New Value   1577  Relief    525  Div 23 false  Throwing To 3
 * Monkey 0:     75 -> Old     44  New Value    836  Relief    278  Div 23 false  Throwing To 3
 * Monkey 0:     76 -> Old      8  New Value    152  Relief     50  Div 23 false  Throwing To 3
 * Monkey 0:     77 -> Old    184  New Value   3496  Relief   1165  Div 23 false  Throwing To 3
 * Monkey 0:     78 -> Old      9  New Value    171  Relief     57  Div 23 false  Throwing To 3
 * Monkey 0:     79 -> Old     20  New Value    380  Relief    126  Div 23 false  Throwing To 3
 * Monkey 0:     80 -> Old     26  New Value    494  Relief    164  Div 23 false  Throwing To 3
 * Monkey 0:     81 -> Old    102  New Value   1938  Relief    646  Div 23 false  Throwing To 3
 * Monkey 1:     74 -> Old    110  New Value    116  Relief     38  Div 19  true  Throwing To 2
 * Monkey 1:     75 -> Old     36  New Value     42  Relief     14  Div 19 false  Throwing To 0
 * Monkey 2:      7 -> Old     38  New Value   1444  Relief    481  Div 13  true  Throwing To 1
 * Monkey 3:     78 -> Old    525  New Value    528  Relief    176  Div 17 false  Throwing To 1
 * Monkey 3:     79 -> Old    278  New Value    281  Relief     93  Div 17 false  Throwing To 1
 * Monkey 3:     80 -> Old     50  New Value     53  Relief     17  Div 17  true  Throwing To 0
 * Monkey 3:     81 -> Old   1165  New Value   1168  Relief    389  Div 17 false  Throwing To 1
 * Monkey 3:     82 -> Old     57  New Value     60  Relief     20  Div 17 false  Throwing To 1
 * Monkey 3:     83 -> Old    126  New Value    129  Relief     43  Div 17 false  Throwing To 1
 * Monkey 3:     84 -> Old    164  New Value    167  Relief     55  Div 17 false  Throwing To 1
 * Monkey 3:     85 -> Old    646  New Value    649  Relief    216  Div 17 false  Throwing To 1
 * 
 * Round 17
 * Monkey 0:     82 -> Old     14  New Value    266  Relief     88  Div 23 false  Throwing To 3
 * Monkey 0:     83 -> Old     17  New Value    323  Relief    107  Div 23 false  Throwing To 3
 * Monkey 1:     76 -> Old    481  New Value    487  Relief    162  Div 19 false  Throwing To 0
 * Monkey 1:     77 -> Old    176  New Value    182  Relief     60  Div 19 false  Throwing To 0
 * Monkey 1:     78 -> Old     93  New Value     99  Relief     33  Div 19 false  Throwing To 0
 * Monkey 1:     79 -> Old    389  New Value    395  Relief    131  Div 19 false  Throwing To 0
 * Monkey 1:     80 -> Old     20  New Value     26  Relief      8  Div 19 false  Throwing To 0
 * Monkey 1:     81 -> Old     43  New Value     49  Relief     16  Div 19 false  Throwing To 0
 * Monkey 1:     82 -> Old     55  New Value     61  Relief     20  Div 19 false  Throwing To 0
 * Monkey 1:     83 -> Old    216  New Value    222  Relief     74  Div 19 false  Throwing To 0
 * Monkey 3:     86 -> Old     88  New Value     91  Relief     30  Div 17 false  Throwing To 1
 * Monkey 3:     87 -> Old    107  New Value    110  Relief     36  Div 17 false  Throwing To 1
 * 
 * Round 18
 * Monkey 0:     84 -> Old    162  New Value   3078  Relief   1026  Div 23 false  Throwing To 3
 * Monkey 0:     85 -> Old     60  New Value   1140  Relief    380  Div 23 false  Throwing To 3
 * Monkey 0:     86 -> Old     33  New Value    627  Relief    209  Div 23 false  Throwing To 3
 * Monkey 0:     87 -> Old    131  New Value   2489  Relief    829  Div 23 false  Throwing To 3
 * Monkey 0:     88 -> Old      8  New Value    152  Relief     50  Div 23 false  Throwing To 3
 * Monkey 0:     89 -> Old     16  New Value    304  Relief    101  Div 23 false  Throwing To 3
 * Monkey 0:     90 -> Old     20  New Value    380  Relief    126  Div 23 false  Throwing To 3
 * Monkey 0:     91 -> Old     74  New Value   1406  Relief    468  Div 23 false  Throwing To 3
 * Monkey 1:     84 -> Old     30  New Value     36  Relief     12  Div 19 false  Throwing To 0
 * Monkey 1:     85 -> Old     36  New Value     42  Relief     14  Div 19 false  Throwing To 0
 * Monkey 3:     88 -> Old   1026  New Value   1029  Relief    343  Div 17 false  Throwing To 1
 * Monkey 3:     89 -> Old    380  New Value    383  Relief    127  Div 17 false  Throwing To 1
 * Monkey 3:     90 -> Old    209  New Value    212  Relief     70  Div 17 false  Throwing To 1
 * Monkey 3:     91 -> Old    829  New Value    832  Relief    277  Div 17 false  Throwing To 1
 * Monkey 3:     92 -> Old     50  New Value     53  Relief     17  Div 17  true  Throwing To 0
 * Monkey 3:     93 -> Old    101  New Value    104  Relief     34  Div 17  true  Throwing To 0
 * Monkey 3:     94 -> Old    126  New Value    129  Relief     43  Div 17 false  Throwing To 1
 * Monkey 3:     95 -> Old    468  New Value    471  Relief    157  Div 17 false  Throwing To 1
 * 
 * Round 19
 * Monkey 0:     92 -> Old     12  New Value    228  Relief     76  Div 23 false  Throwing To 3
 * Monkey 0:     93 -> Old     14  New Value    266  Relief     88  Div 23 false  Throwing To 3
 * Monkey 0:     94 -> Old     17  New Value    323  Relief    107  Div 23 false  Throwing To 3
 * Monkey 0:     95 -> Old     34  New Value    646  Relief    215  Div 23 false  Throwing To 3
 * Monkey 1:     86 -> Old    343  New Value    349  Relief    116  Div 19 false  Throwing To 0
 * Monkey 1:     87 -> Old    127  New Value    133  Relief     44  Div 19 false  Throwing To 0
 * Monkey 1:     88 -> Old     70  New Value     76  Relief     25  Div 19 false  Throwing To 0
 * Monkey 1:     89 -> Old    277  New Value    283  Relief     94  Div 19 false  Throwing To 0
 * Monkey 1:     90 -> Old     43  New Value     49  Relief     16  Div 19 false  Throwing To 0
 * Monkey 1:     91 -> Old    157  New Value    163  Relief     54  Div 19 false  Throwing To 0
 * Monkey 3:     96 -> Old     76  New Value     79  Relief     26  Div 17 false  Throwing To 1
 * Monkey 3:     97 -> Old     88  New Value     91  Relief     30  Div 17 false  Throwing To 1
 * Monkey 3:     98 -> Old    107  New Value    110  Relief     36  Div 17 false  Throwing To 1
 * Monkey 3:     99 -> Old    215  New Value    218  Relief     72  Div 17 false  Throwing To 1
 * 
 * Round 20
 * Monkey 0:     96 -> Old    116  New Value   2204  Relief    734  Div 23 false  Throwing To 3
 * Monkey 0:     97 -> Old     44  New Value    836  Relief    278  Div 23 false  Throwing To 3
 * Monkey 0:     98 -> Old     25  New Value    475  Relief    158  Div 23 false  Throwing To 3
 * Monkey 0:     99 -> Old     94  New Value   1786  Relief    595  Div 23 false  Throwing To 3
 * Monkey 0:    100 -> Old     16  New Value    304  Relief    101  Div 23 false  Throwing To 3
 * Monkey 0:    101 -> Old     54  New Value   1026  Relief    342  Div 23 false  Throwing To 3
 * Monkey 1:     92 -> Old     26  New Value     32  Relief     10  Div 19 false  Throwing To 0
 * Monkey 1:     93 -> Old     30  New Value     36  Relief     12  Div 19 false  Throwing To 0
 * Monkey 1:     94 -> Old     36  New Value     42  Relief     14  Div 19 false  Throwing To 0
 * Monkey 1:     95 -> Old     72  New Value     78  Relief     26  Div 19 false  Throwing To 0
 * Monkey 3:    100 -> Old    734  New Value    737  Relief    245  Div 17 false  Throwing To 1
 * Monkey 3:    101 -> Old    278  New Value    281  Relief     93  Div 17 false  Throwing To 1
 * Monkey 3:    102 -> Old    158  New Value    161  Relief     53  Div 17 false  Throwing To 1
 * Monkey 3:    103 -> Old    595  New Value    598  Relief    199  Div 17 false  Throwing To 1
 * Monkey 3:    104 -> Old    101  New Value    104  Relief     34  Div 17  true  Throwing To 0
 * Monkey 3:    105 -> Old    342  New Value    345  Relief    115  Div 17 false  Throwing To 1
 * 
 * Monkey 0     101  Items   5  10, 12, 14, 26, 34,
 * Monkey 1      95  Items   5  245, 93, 53, 199, 115,
 * Monkey 2       7  Items   0
 * Monkey 3     105  Items   0
 * 
 * (4) [105, 101, 95, 7]
 * 
 * Result Part 1 = 10605
 * Result Part 2 = 0
 * 
 * Day 11 - Ende
 */
