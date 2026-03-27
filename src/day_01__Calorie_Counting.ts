import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/1
 *
 * https://www.reddit.com/r/adventofcode/comments/z9ezjb/2022_day_1_solutions/
 */

function wl( pString : string )
{
    console.log( pString );
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01      : number = 0;
    let result_part_02      : number = 0;

    let vector_elve_calorie : number[] = [];

    let elve_nr             : number = 0;
    let elve_calorie        : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.trim() === "" )
        {
            vector_elve_calorie[ elve_nr ] = elve_calorie;

            wl( "Elve " + elve_nr + "  calorie " + elve_calorie );

            elve_calorie = 0;

            elve_nr++;
        }
        else
        {
            elve_calorie += parseInt( cur_input_str );
        }
    }

    vector_elve_calorie[ elve_nr ] = elve_calorie;

    wl( "Elve " + elve_nr + "  calorie " + elve_calorie );

    vector_elve_calorie.sort( ( a, b ) => b - a );

    result_part_01 = vector_elve_calorie[ 0 ]!;

    for ( let index_v = 0; index_v <= 2; index_v++ )
    {
        wl( index_v + " "  + vector_elve_calorie[ index_v ] )

        result_part_02 += vector_elve_calorie[ index_v ] ?? 0;
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day01_input.txt";

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


function checkReaddatei(): void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];
   
    array_test.push( "1000" );
    array_test.push( "2000" );
    array_test.push( "3000" );
    array_test.push( "" );
    array_test.push( "4000" );
    array_test.push( "" );
    array_test.push( "5000" );
    array_test.push( "6000" );
    array_test.push( "" );
    array_test.push( "7000" );
    array_test.push( "8000" );
    array_test.push( "9000" );
    array_test.push( "" );
    array_test.push( "10000" );

    return array_test;
}


wl( "Day 01 - Calorie Counting" );

//calcArray( getTestArray1(), true );

checkReaddatei();

wl( "Day 01 - Ende" );
