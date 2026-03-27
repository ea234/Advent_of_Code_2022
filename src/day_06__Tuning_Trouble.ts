import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/6
 * 
 * https://www.reddit.com/r/adventofcode/comments/zdw0u6/2022_day_6_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day06/day_06__Tuning_Trouble.js
 * 
 * Day 06 - Tuning Trouble
 * Find 4    7 jpqm  |  Find 14   19 qmgbljsphdztnv  |  mjqjpqmgbljsphdztnvjfqwrcgsmlb
 * Find 4    5 vwbj  |  Find 14   23 vbhsrlpgdmjqwf  |  bvwbjplbgvbhsrlpgdmjqwftvncz
 * Find 4    6 pdvj  |  Find 14   23 ldpwncqszvftbr  |  nppdvjthqldpwncqszvftbrmjlhg
 * Find 4   10 rfnt  |  Find 14   29 wmzdfjlvtqnbhc  |  nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg
 * Find 4   11 zqfr  |  Find 14   26 jwzlrfnpqdbhtm  |  zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw
 * 
 * Result Part 1 = 39
 * Result Part 2 = 120
 * Day 06 - Ende
 * 
 * 
 */

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


function find4( pString : string ) : number 
{
    let index_max : number = pString.length - 4;

    let index_erg : number = -1;

    let index_cur : number = -1;

    while ( ( index_cur < index_max ) && ( index_erg === -1 ) )
    {
        index_cur++;

        let char_1 : string = pString.charAt( index_cur     );
        let char_2 : string = pString.charAt( index_cur + 1 );
        let char_3 : string = pString.charAt( index_cur + 2 );
        let char_4 : string = pString.charAt( index_cur + 3 );

        wl( " " + index_cur + " " + char_1 + "  " + char_2 + "  " + char_3 + "  " + char_4 + " " );

        if ( char_1 === char_2 ) continue;
        if ( char_1 === char_3 ) continue;
        if ( char_1 === char_4 ) continue;

        if ( char_2 === char_3 ) continue;
        if ( char_2 === char_4 ) continue;

        if ( char_3 === char_4 ) continue;

        index_erg =  index_cur + 4; // 3 to get to the end + 1 because 0 indexed
    }

    return index_erg;
}


function checkForChar( pString : string, pIndexO : number, pMaxIndex : number ) : boolean 
{
    let char_o : string = pString.charAt( pIndexO );

    for ( let start_i = pIndexO + 1; start_i <= pMaxIndex; start_i++ )
    {
        let char_i : string = pString.charAt( start_i );

        if ( char_o === char_i )
        {
            return true; // Yes, there is another char like char_o
        }
    }

    return false; // No, there isn't another char like char_o
}


function findUnique( pString : string, pNumberDistinctCharacters : number, pKnzDebug : boolean ) : number 
{
    let find_nr            : number = pNumberDistinctCharacters;

    let find_index_to_plus : number = find_nr -1;

    let index_max          : number = pString.length - find_index_to_plus;

    let index_result       : number = -1;

    let index_cur          : number = -1;

    while ( ( index_cur < index_max ) && ( index_result === -1 ) )
    {
        index_cur++;

        let knz_found_pair : boolean = false;

        let index_from : number = index_cur;
        let index_to   : number = index_cur + find_index_to_plus;

        if ( pKnzDebug )
        {
            wl( "Index_from " + index_from + " to " + index_to + "  Char from " + pString.charAt( index_from )! + " to " + pString.charAt( index_to )! + " "  );
        }

        for ( let start_o = index_from; start_o < index_to; start_o++ )
        {
            knz_found_pair = checkForChar( pString, start_o, index_to );

            if ( knz_found_pair )
            {
                if ( pKnzDebug )
                {
                    wl( "Found pair at " + start_o + " " + pString.charAt( start_o ) );
                }

                break;
            }
        }

        if ( knz_found_pair === false )
        {
            index_result =  index_to + 1;

            if ( pKnzDebug )
            {
                wl( "Result found at " + index_cur + "  " + pString.substring( index_from, index_to + 1 ) );
            }
        }
    }

    return index_result;
}


function getSubStringR( pString : string, pNumberFrom : number, pCountChars : number ) : string 
{
    let index_to   : number = pNumberFrom - 1;

    let index_from : number = index_to - ( pCountChars - 1 );

    return pString.substring( index_from, index_to + 1 )
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.trim() !== "" )
        {
            let result_find_4  : number = findUnique( cur_input_str,  4, false );
            let result_find_14 : number = findUnique( cur_input_str, 14, false );

            if ( pKnzDebug )
            {
               wl( "Find 4 " + pad( result_find_4, 4 ) + " " +  getSubStringR( cur_input_str, result_find_4, 4 ) +  "  |  Find 14 " + pad( result_find_14, 4 )  + " " +  getSubStringR( cur_input_str, result_find_14, 14 ) +  "  |  " + cur_input_str );
            }

            result_part_01 += result_find_4;
            result_part_02 += result_find_14;
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day06_input.txt";

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


function getTestArray1(): string[] 
{
    const array_test: string[] = [];
    
    array_test.push( "mjqjpqmgbljsphdztnvjfqwrcgsmlb"    );
    array_test.push( "bvwbjplbgvbhsrlpgdmjqwftvncz"      );
    array_test.push( "nppdvjthqldpwncqszvftbrmjlhg"      );
    array_test.push( "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg" );
    array_test.push( "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"  );

    return array_test;
}


wl( "Day 06 - Tuning Trouble" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "Day 06 - Ende" );
