import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day25
 * 
 * https://www.reddit.com/r/adventofcode/comments/zur1an/2022_day_25_solutions/
 * 
 * C:\Program Files\nodejs\node.exe .\dist\day25\day_25__Full_Of_Hot_Air.js
 * 
 * Day 25 - Full of Hot Air
 * 
 * From Snafu 2-1212==0==21===2=
 * pos 1 = -2 * pwr5 1 =    -2  -     -2
 * pos 2 2  2 * pwr5 5 =    10  -      8
 * pos 3 = -2 * pwr5 25 =   -50  -    -42
 * pos 4 = -2 * pwr5 125 =  -250  -   -292
 * pos 5 = -2 * pwr5 625 = -1250  -  -1542
 * pos 6 1  1 * pwr5 3125 =  3125  -   1583
 * pos 7 2  2 * pwr5 15625 = 31250  -  32833
 * pos 8 = -2 * pwr5 78125 = -156250  - -123417
 * pos 9 = -2 * pwr5 390625 = -781250  - -904667
 * pos 10 0  0 * pwr5 1953125 =     0  - -904667
 * pos 11 = -2 * pwr5 9765625 = -19531250  - -20435917
 * pos 12 = -2 * pwr5 48828125 = -97656250  - -118092167
 * pos 13 2  2 * pwr5 244140625 = 488281250  - 370189083
 * pos 14 1  1 * pwr5 1220703125 = 1220703125  - 1590892208
 * pos 15 2  2 * pwr5 6103515625 = 12207031250  - 13797923458
 * pos 16 1  1 * pwr5 30517578125 = 30517578125  - 44315501583
 * pos 17 - -1 * pwr5 152587890625 = -152587890625  - -108272389042
 * pos 18 2  2 * pwr5 762939453125 = 1525878906250  - 1417606517208
 * 
 * From Snafu 1=
 * pos 1 = -2 * pwr5 1 =    -2  -     -2
 * pos 2 1  1 * pwr5 5 =     5  -      3
 * 
 * From Snafu 2=-01
 * pos 1 1  1 * pwr5 1 =     1  -      1
 * pos 2 0  0 * pwr5 5 =     0  -      1
 * pos 3 - -1 * pwr5 25 =   -25  -    -24
 * pos 4 = -2 * pwr5 125 =  -250  -   -274
 * pos 5 2  2 * pwr5 625 =  1250  -    976
 * 
 * checkSnafu          1 =          1 should be          1   OK
 * checkSnafu          2 =          2 should be          2   OK
 * checkSnafu         1= =          3 should be          3   OK
 * checkSnafu         1- =          4 should be          4   OK
 * checkSnafu         10 =          5 should be          5   OK
 * checkSnafu         11 =          6 should be          6   OK
 * checkSnafu         12 =          7 should be          7   OK
 * checkSnafu         2= =          8 should be          8   OK
 * checkSnafu         2- =          9 should be          9   OK
 * checkSnafu         20 =         10 should be         10   OK
 * checkSnafu        1=0 =         15 should be         15   OK
 * checkSnafu        1-0 =         20 should be         20   OK
 * checkSnafu     1=11-2 =       2022 should be       2022   OK
 * checkSnafu    1-0---0 =      12345 should be      12345   OK
 * checkSnafu 1121-1110-1=0 =  314159265 should be  314159265   OK
 * checkSnafu     1=-0-2 =       1747 should be       1747   OK
 * checkSnafu      12111 =        906 should be        906   OK
 * checkSnafu       2=0= =        198 should be        198   OK
 * checkSnafu         21 =         11 should be         11   OK
 * checkSnafu       2=01 =        201 should be        201   OK
 * checkSnafu        111 =         31 should be         31   OK
 * checkSnafu      20012 =       1257 should be       1257   OK
 * checkSnafu        112 =         32 should be         32   OK
 * checkSnafu      1=-1= =        353 should be        353   OK
 * checkSnafu       1-12 =        107 should be        107   OK
 * checkSnafu         12 =          7 should be          7   OK
 * checkSnafu         1= =          3 should be          3   OK
 * checkSnafu        122 =         37 should be         37   OK
 * 
 * Day 25 - Ende
 * 
 */

function wl( pString : string )
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


function fromSnafu( pInput : string, pKnzDebug : boolean ) : number 
{
/*
 * 
 * SNAFU number 2=-01. 
 * 
 * That's 2                in the 625s place,     (  2 times 625 )   1250
 *        = (double-minus) in the 125s place,   + ( -2 times 125 ) + -250
 *        - (minus)        in the  25s place,   + ( -1 times  25 ) +  -25
 *        0                in the   5s place,   + (  0 times   5 ) +    0
 *        1                in the   1s place.   + (  1 times   1 ) +    1 
 *                                                                    976
 */
    if ( pKnzDebug )
    {
        wl( "" );
        wl( "From Snafu " + pInput )
    }

    let snafu_nr          : string = pInput;

    let decimal_nr        : number = 0;

    let cur_multiplicator : number = 0;

    let position_nr       : number = 1;

    let power_of_5        : number = 1;

    for ( let index_str : number = ( snafu_nr.length - 1 ); index_str >= 0; index_str-- )
    {
        let cur_char : string = snafu_nr.charAt( index_str );

        if ( cur_char === "=" )
        {
            cur_multiplicator = -2
        }
        else if ( cur_char === "-" )
        {
            cur_multiplicator = -1
        }
        else
        {
            cur_multiplicator = parseInt( cur_char );
        }

        let result_cur_pos : number = cur_multiplicator * power_of_5;

        decimal_nr += result_cur_pos;

        if ( pKnzDebug )
        {
            wl( "pos " + position_nr + " " + cur_char + " " + padL( cur_multiplicator, 2) + " * pwr5 " + power_of_5 + " = " + padL( result_cur_pos, 5 ) + "  - " + padL( decimal_nr, 6 ) + " ")
        }

        power_of_5 = Math.pow( 5, position_nr );

        position_nr++;
    }

    if ( pKnzDebug )
    {
        wl( "" );
    }

    return decimal_nr;
}

function checkSnafu( pSnafu : string, pDecimal : number ) : void 
{
    let dec_nr_decoded : number = fromSnafu( pSnafu, false );

    wl( "checkSnafu " + padL( pSnafu, 10 ) + " = " + padL( dec_nr_decoded, 10 ) + " should be " + padL( pDecimal, 10 ) + "  " + ( dec_nr_decoded === pDecimal ? " OK " : "#### Fehler ####" ) );
}

function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01   : number = 0;
    let result_part_02   : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        let decimal_nr : number = fromSnafu( cur_input_str.trim(), false );

        result_part_01 += decimal_nr;

        if ( pKnzDebug )
        {
            wl( "SNAFU " + padL( cur_input_str, 8 ) + "  Decimal " + padL( decimal_nr, 8 ) + "  SUM " + padL( result_part_01, 10 ) )
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    //const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day25_input.txt";
    const filePath: string = "c:/Daten/aoc2022_d25_input.txt";

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

    array_test.push( "1=-0-2" );
    array_test.push( "12111"  );
    array_test.push( "2=0="   );
    array_test.push( "21"     );
    array_test.push( "2=01"   );
    array_test.push( "111"    );
    array_test.push( "20012"  );
    array_test.push( "112"    );
    array_test.push( "1=-1="  );
    array_test.push( "1-12"   );
    array_test.push( "12"     );
    array_test.push( "1="     );
    array_test.push( "122"    );

    return array_test;
}

wl( "" );
wl( "Day 25 - Full of Hot Air" );
wl( "" );

//calcArray( getTestArray1(), true );
//checkReaddatei();

let dec_nr_decoded = fromSnafu( "2-1212==0==21===2=", true );

let knz_debug_snafu_fkt : boolean = true;

if ( knz_debug_snafu_fkt )
{
    let dec_nr_decoded = fromSnafu( "1=", true );

    dec_nr_decoded = fromSnafu( "2=-01", true );

    checkSnafu( "1",             1         );
    checkSnafu( "2",             2         );
    checkSnafu( "1=",            3         );
    checkSnafu( "1-",            4         );
    checkSnafu( "10",            5         );
    checkSnafu( "11",            6         );
    checkSnafu( "12",            7         );
    checkSnafu( "2=",            8         );
    checkSnafu( "2-",            9         );
    checkSnafu( "20",            10        );
    checkSnafu( "1=0",           15        );
    checkSnafu( "1-0",           20        );
    checkSnafu( "1=11-2",        2022      );
    checkSnafu( "1-0---0",       12345     );
    checkSnafu( "1121-1110-1=0", 314159265 );

    checkSnafu( "1=-0-2", 1747 );
    checkSnafu( "12111",  906  );
    checkSnafu( "2=0=",   198  );
    checkSnafu( "21",     11   );
    checkSnafu( "2=01",   201  );
    checkSnafu( "111",    31   );
    checkSnafu( "20012",  1257 );
    checkSnafu( "112",    32   );
    checkSnafu( "1=-1=",  353  );
    checkSnafu( "1-12",   107  );
    checkSnafu( "12",     7    );
    checkSnafu( "1=",     3    );
    checkSnafu( "122",    37   );
}

wl( "" )
wl( "Day 25 - Ende" );

