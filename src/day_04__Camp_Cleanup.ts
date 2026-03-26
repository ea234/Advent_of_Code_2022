import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/4
 */

function wl( pString : string )
{
    console.log( pString );
}


function checkOverlappingPart1( pFromA : number, pToA : number, pFromB : number, pToB : number ) : number
{
    let check_b_from_in_a : boolean = ( ( pFromB >= pFromA ) && ( pFromB <= pToA ) );
    let check_b_to_in_a   : boolean = ( ( pToB   >= pFromA ) && ( pToB   <= pToA ) );

    if ( check_b_from_in_a && check_b_to_in_a )
    {
        return 1;
    }

    let check_a_from_in_b : boolean = ( ( pFromA >= pFromB ) && ( pFromA <= pToB ) );
    let check_a_to_in_b   : boolean = ( ( pToA   >= pFromB ) && ( pToA   <= pToB ) );

    if ( check_a_from_in_b && check_a_to_in_b )
    {
        return 1;
    }

    return 0;
}


function checkOverlappingPart2( pFromA : number, pToA : number, pFromB : number, pToB : number ) : number
{
    let check_b_from_in_a : boolean = ( ( pFromB >= pFromA ) && ( pFromB <= pToA ) );
    let check_b_to_in_a   : boolean = ( ( pToB   >= pFromA ) && ( pToB   <= pToA ) );

    if ( check_b_from_in_a && check_b_to_in_a )
    {
        return 1;
    }

    let check_a_from_in_b : boolean = ( ( pFromA >= pFromB ) && ( pFromA <= pToB ) );
    let check_a_to_in_b   : boolean = ( ( pToA   >= pFromB ) && ( pToA   <= pToB ) );

    if ( check_a_from_in_b && check_a_to_in_b )
    {
        return 1;
    }

    if ( ( pFromA < pFromB ) && ( pToA < pFromB ) ) 
    {
        return 0; // Part A completely before Part B
    }

    if ( ( pFromB < pFromA ) && ( pToB < pFromA ) ) 
    {
        return 0; // Part B completely before Part A
    }


    if ( ( pFromA > pToB ) && ( pToA > pToB ) )
    {
        return 0; // Part A completely after Part B
    }

    if ( ( pFromB > pToA ) && ( pToB > pToA ) )
    {
        return 0; // Part B completely after Part A
    }

    return 1;
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.trim() !== "" )
        {
            const [ elve_a_range, elve_b_range ] = cur_input_str.split( "," );

            const [ elve_a_from, elve_a_to ] = elve_a_range!.split( "-" );
            const [ elve_b_from, elve_b_to ] = elve_b_range!.split( "-" );

            // wl( " " + elve_a + "  from " + e_a_from + "  to  " + e_a_to );
            // wl( " " + elve_b + "  from " + e_b_from + "  to  " + e_b_to );

            let a_from : number = parseInt( elve_a_from! );
            let a_to   : number = parseInt( elve_a_to! );
            
            let b_from : number = parseInt( elve_b_from! );
            let b_to   : number = parseInt( elve_b_to! );

            result_part_01 += checkOverlappingPart1( a_from, a_to, b_from, b_to );
            result_part_02 += checkOverlappingPart2( a_from, a_to, b_from, b_to );
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day04_input.txt";

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
    
    array_test.push( "2-4,6-8" );
    array_test.push( "2-3,4-5" );
    array_test.push( "5-7,7-9" );
    array_test.push( "2-8,3-7" );
    array_test.push( "6-6,4-6" );
    array_test.push( "2-6,4-8" );

    return array_test;
}


wl( "Day 04 - Camp Cleanup" );

//calcArray( getTestArray1(), true );

checkReaddatei();

wl( "Day 04 - Ende" );
