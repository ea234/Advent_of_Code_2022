import { promises as fs } from 'fs';
import { pid } from 'process';
import * as readline from 'readline';

const ROCK_G        : string = "Rock";
const PAPER_G       : string = "Paper";
const SICCORS_G     : string = "Siccors";

const ROCK_VALUE    : number = 1;
const PAPER_VALUE   : number = 2;
const SICCORS_VALUE : number = 3;

const VALUE_LOST    : number = 0;
const VALUE_DRAW    : number = 3;
const VALUE_WON     : number = 6;

const ROCK_A        : string = "A";
const PAPER_B       : string = "B";
const SICCORS_C     : string = "C";

const ROCK_X        : string = "X";
const PAPER_Y       : string = "Y";
const SICCORS_Z     : string = "Z";


function wl( pString : string )
{
    console.log( pString );
}


function translateX( pInput : string ) : string 
{
    if ( pInput === ROCK_A ) return ROCK_G;
    if ( pInput === PAPER_B ) return PAPER_G;
    if ( pInput === SICCORS_C ) return SICCORS_G;

    if ( pInput === ROCK_X ) return ROCK_G;
    if ( pInput === PAPER_Y ) return PAPER_G;
    if ( pInput === SICCORS_Z ) return SICCORS_G;

    return "unknown";
}


// 

// and  Good luck!"

function checkRound2( pPlayerA : string, pIndicator : string ) : string 
{
    const shape_player_a = translateX( pPlayerA );


    if ( pIndicator === "Y" )
    {
        /*
         * Y means you need to end the round in a draw, 
         */
        return pPlayerA;
    }

    if ( pIndicator === "Z" )
    {
        /*
         * Z means you need to win.
         */        
        if ( shape_player_a == ROCK_G  ) return PAPER_Y;

        if ( shape_player_a == PAPER_G ) return SICCORS_Z;
        
        if ( shape_player_a == SICCORS_G ) return ROCK_X;
    }

    if ( pIndicator === "X" )
    {
        /*
         * X means you need to lose, 
         */
        if ( shape_player_a == ROCK_G  ) return SICCORS_Z;

        if ( shape_player_a == PAPER_G ) return ROCK_X;
        
        if ( shape_player_a == SICCORS_G ) return PAPER_Y;
    }

    return "M";
}


function checkWinPlayerA( pPlayerA : string, pPlayerB : string ) : number 
{
    const shape_player_a = translateX( pPlayerA );

    const shape_player_b = translateX( pPlayerB );

    // Rock defeats Scissors, 
    // Scissors defeats Paper, 
    // Paper defeats Rock. 

    if ( ( shape_player_a == ROCK_G    ) && ( shape_player_b == ROCK_G    ) ) return ROCK_VALUE + VALUE_DRAW;

    if ( ( shape_player_a == PAPER_G   ) && ( shape_player_b == PAPER_G   ) ) return PAPER_VALUE + VALUE_DRAW;

    if ( ( shape_player_a == SICCORS_G ) && ( shape_player_b == SICCORS_G ) ) return SICCORS_VALUE + VALUE_DRAW;


    if ( ( shape_player_a == ROCK_G    ) && ( shape_player_b == SICCORS_G ) ) return ROCK_VALUE + VALUE_WON;

    if ( ( shape_player_a == SICCORS_G ) && ( shape_player_b == PAPER_G   ) ) return SICCORS_VALUE + VALUE_WON;

    if ( ( shape_player_a == PAPER_G   ) && ( shape_player_b == ROCK_G    ) ) return PAPER_VALUE + VALUE_WON;

    if ( shape_player_a == ROCK_G    ) return ROCK_VALUE;

    if ( shape_player_a == PAPER_G   ) return PAPER_VALUE;

    if ( shape_player_a == SICCORS_G ) return SICCORS_VALUE;

    return VALUE_LOST;
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.trim() !== "" )
        {
            const [ player_a, player_b ] = cur_input_str.split(" ");

            let win_val : number = checkWinPlayerA( player_b!, player_a! );

            wl( "player_a " + player_a + " (" +  translateX( player_a! ) + ")  player_b " + player_b + " (" +  translateX( player_b! ) + ") win value " + win_val );

            result_part_01 += win_val;

            let player_b1 = checkRound2( player_a!, player_b! );

            win_val = checkWinPlayerA( player_b1, player_a! );

            wl( "player_a " + player_a + " (" +  translateX( player_a! ) + ")  player_b " + player_b + " => " + player_b1 + " (" +  translateX( player_b1 ) + ") win value " + win_val );

            result_part_02 += win_val;
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day02_input.txt";

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
   
    array_test.push( "A Y" );
    array_test.push( "B X" );
    array_test.push( "C Z" );

    return array_test;
}


wl( "Day 02 - Rock Paper Scissors" );

//calcArray( getTestArray1(), true );

checkReaddatei();

wl( "Day 02 - Ende" );
