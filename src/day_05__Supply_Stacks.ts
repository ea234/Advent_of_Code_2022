import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/5
 * 
 * https://www.reddit.com/r/adventofcode/comments/zcxid5/2022_day_5_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day05/day_05__Supply_Stacks.js
 * Day 05 - Supply Stacks
 *     [D]
 * [N] [C]
 * [Z] [M] [P]
 *  1   2   3
 * index 0 undefined
 * index 1 1
 * index 2 5
 * index 3 9
 * Move  1  from ' 2 '  1
 * Move  3  from ' 1 '  3
 * Move  2  from ' 2 '  1
 * Move  1  from ' 1 '  2
 * 
 * ----------------------------------------------------------------------
 * 
 * 1 C,
 * 2 M,
 * 3 P, D, N, Z,
 * 
 * ----------------------------------------------------------------------
 * 
 * Result CMZ
 * Day 05 - Ende
 * 
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day05/day_05__Supply_Stacks.js
 * Day 05 - Supply Stacks
 *     [D]
 * [N] [C]
 * [Z] [M] [P]
 *  1   2   3
 * index 0 undefined
 * index 1 1
 * index 2 5
 * index 3 9
 * Move  1  from ' 2 '  1
 * Move  3  from ' 1 '  3
 * Move  2  from ' 2 '  1
 * Move  1  from ' 1 '  2
 * 
 * ----------------------------------------------------------------------
 * 
 * 1 M,
 * 2 C,
 * 3 P, Z, N, D,
 * 
 * ----------------------------------------------------------------------
 * 
 * Result MCD
 * Day 05 - Ende
 * 
 */

function wl( pString : string )
{
    console.log( pString );
}


class CrateStack 
{
    private name  : string;
    private items : string[] = [];

    constructor( pName : string )
    {
        this.name = pName;
    }

    push( pString : string ): void 
    {
        this.items.push( pString );
    }

    pop(): string | undefined 
    {
        return this.items.pop();
    }

    pushStringVector( pValues : string[] ): void 
    {
        /*
         * Pushing in reverse order
         */
        for ( let index = ( pValues.length - 1 ); index >= 0; index-- )
        {
            this.items.push( pValues[ index ]! );
        }
    }

    popStringVector( pAmount : number ) : string[] 
    { 
        const result_vector: string[] = []; 

        for (let i = 0; i < pAmount; i++ ) 
        { 
            const value = this.pop(); 

            if ( value === undefined ) break; 

            result_vector.push(value); 
        } 

        return result_vector; 
    }

    peek(): string | undefined 
    {
        return this.items[this.items.length - 1];
    }

    size(): number 
    {
        return this.items.length;
    }

    isEmpty(): boolean 
    {
        return this.items.length === 0;
    }

    toArray(): string[] 
    {
        return [...this.items];
    }

    private getItems() : string 
    {
        let str_result : string = "";

        for ( const str_x of this.items )
        {
            str_result += str_x + ", "
        }

        return str_result;
    }

    toString(): string
    {
        return this.name + " " + this.getItems();
    }
}


function moveStackPart01( pCrateStacks : Record< string, CrateStack >, pAmount : number, pFrom : number, pTo :number  ) : void 
{
    for ( let nr : number = 0; nr < pAmount; nr++ )
    {
        let pop_string = pCrateStacks[ pFrom ]!.pop()!;

        if ( pop_string != undefined )
        {
            pCrateStacks[ pTo ]!.push( pop_string ); 
        }
        else 
        { 
            wl( "pop_string is undefined " );
        }
    }
}


function moveStackPart02( pCrateStacks : Record< string, CrateStack >, pAmount : number, pFrom : number, pTo :number  ) : void 
{
    let pop_string_vector : string[] = pCrateStacks[ pFrom ]!.popStringVector( pAmount )!;

    if ( pop_string_vector != undefined )
    { 
        pCrateStacks[ pTo ]!.pushStringVector( pop_string_vector ); 
    }
    else 
    {
        wl( "pop_string_vector is undefined " );
    }
}


function getPeekString( pCrateStacks : Record< string, CrateStack >, pIndexVector : number[] ) : string
{
    let str_peek = "";

    for ( let index_stack = 0; index_stack < pIndexVector.length; index_stack++ )
    {
        if ( ( pIndexVector[ index_stack ] !== undefined ) && ( pIndexVector[ index_stack ]! > 0 ) )
        {
            str_peek += pCrateStacks[ index_stack ]!.peek()!; 
        }
    }

    return str_peek;
}


function calcArray( pArray: string[], pKnzCalcPart02 : boolean = false, pKnzDebug : boolean = true ): void 
{
    let index_empty_row : number = 0;

    /*
     * *******************************************************************************************************
     * Searching the blank line
     * *******************************************************************************************************
     */

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.trim() === "" )
        {         
            break;
        }

        wl( cur_input_str );

        index_empty_row++;
    }

    /*
     * *******************************************************************************************************
     * Creating the crate_stack-vector and determine the index for the box letters
     * *******************************************************************************************************
     */

    let crate_stacks        : Record< string, CrateStack > = {}

    let index_cargo_col     : number[] = [];

    let input_line_stack_nr : string = pArray[ index_empty_row - 1 ]!;

    for ( let index_a = 0; index_a < input_line_stack_nr.length; index_a++ )
    {
        let cargo_stack_nr = input_line_stack_nr.charCodeAt( index_a ) - 48;

        if ( ( cargo_stack_nr >= 0 ) && ( cargo_stack_nr <= 9 ) ) 
        {
            index_cargo_col[ cargo_stack_nr ] = index_a;

            crate_stacks[ cargo_stack_nr ] = new CrateStack( "" + cargo_stack_nr );
        }
    }

    /*
     * *******************************************************************************************************
     * Setting undefined stacks to -1
     * *******************************************************************************************************
     */
    for ( let index_a = 0; index_a < index_cargo_col.length; index_a++ )
    {
        wl( "index " + index_a + " " + index_cargo_col[ index_a ] );

        if ( index_cargo_col[ index_a ] === undefined )
        {
            index_cargo_col[ index_a ] = -1;
        }
    }

    /*
     * *******************************************************************************************************
     * Reading the letters for the initial stack-values
     * *******************************************************************************************************
     */

    for ( let index_input = (index_empty_row - 2); index_input >= 0; index_input-- )
    {
        let cur_line_input : string = pArray[ index_input ]!;

        for ( let index_stack = 0; index_stack < index_cargo_col.length; index_stack++ )
        {
            if (( index_cargo_col[ index_stack ] !== undefined ) && ( index_cargo_col[ index_stack ]! > 0 ) )
            {
                let cur_char = cur_line_input.charAt( index_cargo_col[ index_stack ]! )

                if ( cur_char != " " )
                {
                    //wl( "Stack " + index_stack + " Pos " + index_cargo_col[ index_stack ]! + " Char " + cur_char );

                    crate_stacks[ index_stack ]!.push( cur_char ); 
                }
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Doing the box moves
     * *******************************************************************************************************
     */

    for ( let index_input = (index_empty_row + 1); index_input < pArray.length; index_input++ )
    {
        let cur_line_input     : string = pArray[ index_input ]!;

        let index_amount_start : number = 4;
        let index_from         : number = cur_line_input.indexOf( "from" );
        let index_to           : number = cur_line_input.indexOf( "to"   );

        if (( index_from > 0 ) && ( index_to > 0)) 
        {
            let move_amount : number = parseInt( cur_line_input.substring( index_amount_start, index_from ) );
            let move_from   : number = parseInt( cur_line_input.substring( index_from + 4, index_to       ) );
            let move_to     : number = parseInt( cur_line_input.substring( index_to + 2                   ) );

            wl( "Move "  + move_amount + " from "  + move_from + " To " + move_to )

            if ( pKnzCalcPart02 ) 
            { 
                moveStackPart02( crate_stacks, move_amount, move_from, move_to );
            }
            else
            { 
                moveStackPart01( crate_stacks, move_amount, move_from, move_to );
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Debug-Infos
     * *******************************************************************************************************
     */

    wl( "" );
    wl( "----------------------------------------------------------------------" );
    wl( "" );
    
    for ( let index_stack = 0; index_stack < index_cargo_col.length; index_stack++ )
    {
        if (( index_cargo_col[ index_stack ] !== undefined ) && ( index_cargo_col[ index_stack ]! > 0 ) )
        {
            wl( crate_stacks[ index_stack ]!.toString() ); 
        }
    }

    /*
     * *******************************************************************************************************
     * Displaying Result
     * *******************************************************************************************************
     */

    wl( "" );
    wl( "----------------------------------------------------------------------" );
    wl( "" );
    wl( "Result " + getPeekString( crate_stacks, index_cargo_col ) );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day05_input.txt";

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

        calcArray( arrFromFile, false, false );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];
    
    array_test.push( "    [D]    " );
    array_test.push( "[N] [C]    " );
    array_test.push( "[Z] [M] [P]" );
    array_test.push( " 1   2   3 " );
    array_test.push( "" );
    array_test.push( "move 1 from 2 to 1" );
    array_test.push( "move 3 from 1 to 3" );
    array_test.push( "move 2 from 2 to 1" );
    array_test.push( "move 1 from 1 to 2" );

    return array_test;
}


wl( "Day 05 - Supply Stacks" );

calcArray( getTestArray1(), false, true );

//checkReaddatei();

wl( "Day 05 - Ende" );
