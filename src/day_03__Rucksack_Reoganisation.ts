import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/3
 *
 * https://www.reddit.com/r/adventofcode/comments/zb865p/2022_day_3_solutions/
 */

function wl( pString : string )
{
    console.log( pString );
}


function getCharValue( pString : string ) : number 
{
    if ( ( pString[ 0 ]! >= "A" ) && ( pString[ 0 ]! <= "Z" ) )
    {
        return pString.charCodeAt( 0 ) - 38;
    }

    if ( ( pString[ 0 ]! >= "a" ) && ( pString[ 0 ]! <= "z" ) )
    {
        return pString.charCodeAt( 0 ) - 96;
    }

    return -1000;
}


function checkString( pString : string ) : number
{
    let check_char_codes : number[] = []

    let str_half = pString.length / 2 ;

    for ( let index_a = 0; index_a < str_half; index_a++ )
    {
        check_char_codes[ pString.charCodeAt( index_a ) ] = 1;
    }

    let index_double = 0;

    for ( let index_a = 0; index_a < str_half; index_a++ )
    {
        let index_b = index_a + str_half;

        if ( ( check_char_codes[ pString.charCodeAt( index_b ) ] ?? 0 ) > 0 )
        {
            index_double = index_b;
        }
    }

    if ( index_double > 0 )
    {
        return getCharValue( pString[ index_double ]! );
    }

    return 0;
}


function toSet( pInput : string ) : Set<string> 
{
  return new Set( pInput.split(''));
}


function getIntersection( pSetA : Set< string >, pSetB : Set< string > ): Set< string > 
{
  const res = new Set< string >();

  for ( const v of pSetA ) 
  {
    if ( pSetB.has(v) ) res.add( v );
  }

  return res;
}


function getString( pSet: Set< string > ) : string 
{
  let res : string = "";

  for ( const v of pSet ) 
  {
    res += " " + v.toString();
  }

  return res;
}


function findSetX( pInputA : string, pInputB : string, pInputC : string ) : number 
{
    const set_a = toSet( pInputA );
    const set_b = toSet( pInputB );
    const set_c = toSet( pInputC );

    // wl( "--------------------------------------------------------");
    // wl( getString( set_a ) );
    // wl( getString( set_b ) );
    // wl( getString( set_c ) );

    const set_d = getIntersection( set_a, set_b );

    //wl( getString( set_d ) );

    const set_e = getIntersection( set_d, set_c );

    //wl( getString( set_e ) );

    const s1 : string = getString( set_e ).trim();

    //wl( "Char Result " + s1[0] )

    return getCharValue( s1[ 0 ]! );
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let cur_index   : number = 0;
    let index_count : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.trim() !== "" )
        {
            index_count++;

            //wl( " " + cur_input_str + "  k " + cur_input_str.length + "  k " + ( cur_input_str.length / 2) );

            result_part_01 += checkString( cur_input_str );

            if ( index_count == 3 )
            {
                result_part_02 += findSetX( pArray[ cur_index ]!, pArray[ cur_index - 1 ]!, pArray[ cur_index - 2 ]! )

                index_count = 0;
            }
        }

        cur_index++;
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day03_input.txt";

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
    
    array_test.push( "vJrwpWtwJgWrhcsFMMfFFhFp" );
    array_test.push( "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL" );
    array_test.push( "PmmdzqPrVvPwwTWBwg" );
    array_test.push( "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn" );
    array_test.push( "ttgJtRGJQctTZtZT" );
    array_test.push( "CrZsJsPPZsGzwwsLwLmpwMDw" );

    return array_test;
}


wl( "Day 03 - Rucksack Reorganization" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "Day 03 - Ende" );
