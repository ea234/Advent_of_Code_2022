import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 23: Unstable Diffusion ---
 * https://adventofcode.com/2022/day23
 * 
 * https://www.reddit.com/r/adventofcode/comments/zt6xz5/2022_day_23_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2022/blob/main/src/day_23__Unstable_Diffusion.ts
 * 
 * 
 * C:\Program Files\nodejs\node.exe .\dist\day23\day_23__Unstable_Diffusion.js
 * 
 * Day 23: Unstable Diffusion
 * 
 * Initial Map
 *      012345
 *   0  ......
 *   1  ..##..
 *   2  ..#...
 *   3  ......
 *   4  ..##..
 *   5  ......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 0
 * 
 * Elf Nr.    0   11002 -> 10002 N MOVE   N0 S1 W1 E0   N,S,W,E
 * Elf Nr.    1   11003 -> 10003 N MOVE   N0 S1 W1 E1   N,S,W,E
 * Elf Nr.    2   12002 -> 13002 S MOVE   N2 S0 W0 E1   N,S,W,E
 * Elf Nr.    3   14002 -> 13002 N MOVE   N0 S0 W1 E0   N,S,W,E
 * Elf Nr.    4   14003 -> 13003 N MOVE   N0 S0 W0 E1   N,S,W,E
 * 
 * count_moved_elfs 3
 * 
 *      012345          012345
 *   0  ......       0  ..##..
 *   1  ..##..       1  ......
 *   2  ..#...       2  ..#...
 *   3  ......       3  ...#..
 *   4  ..##..       4  ..#...
 *   5  ......       5  ......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 1
 * 
 * Elf Nr.    0   10002 -> 11002 S MOVE   N0 S0 W1 E0   S,W,E,N
 * Elf Nr.    1   10003 -> 11003 S MOVE   N0 S0 W0 E1   S,W,E,N
 * Elf Nr.    2   12002 -> 12001 W MOVE   N0 S1 W0 E1   S,W,E,N
 * Elf Nr.    3   14002 -> 15002 S MOVE   N1 S0 W0 E1   S,W,E,N
 * Elf Nr.    4   13003 -> 13004 E MOVE   N1 S1 W2 E0   S,W,E,N
 * 
 * count_moved_elfs 5
 * 
 *      012345          012345
 *   0  ..##..       0  ......
 *   1  ......       1  ..##..
 *   2  ..#...       2  .#....
 *   3  ...#..       3  ....#.
 *   4  ..#...       4  ......
 *   5  ......       5  ..#...
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 2
 * 
 * Elf Nr.    0   11002 -> 11003 E MOVE   N0 S1 W2 E0   W,E,N,S
 * Elf Nr.    1   11003 -> 11002 W MOVE   N0 S0 W0 E1   W,E,N,S
 * Elf Nr.    2   12001 -> 12000 W MOVE   N1 S0 W0 E1   W,E,N,S
 * Elf Nr.    3   15002 -> 15002 S  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    4   13004 -> 13004 E  --    N0 S0 W0 E0   W,E,N,S
 * 
 * count_moved_elfs 3
 * 
 *      012345          012345
 *   0  ......       0  ......
 *   1  ..##..       1  ..#...
 *   2  .#....       2  #.....
 *   3  ....#.       3  ....#.
 *   4  ......       4  ......
 *   5  ..#...       5  ..#...
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 3
 * 
 * Elf Nr.    0   11003 -> 10003 N MOVE   N0 S0 W0 E1   E,N,S,W
 * Elf Nr.    1   11002 -> 11002 W  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    2   12000 -> 12000 W  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    3   15002 -> 15002 S  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    4   13004 -> 13004 E  --    N0 S0 W0 E0   E,N,S,W
 * 
 * count_moved_elfs 1
 * 
 *      012345          012345
 *   0  ......       0  ...#..
 *   1  ..#...       1  ..#...
 *   2  #.....       2  #.....
 *   3  ....#.       3  ....#.
 *   4  ......       4  ......
 *   5  ..#...       5  ..#...
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 4
 * 
 * Elf Nr.    0   10003 -> 10004 E MOVE   N0 S1 W1 E0   N,S,W,E
 * Elf Nr.    1   11002 -> 12002 S MOVE   N1 S0 W0 E1   N,S,W,E
 * Elf Nr.    2   12000 -> 12000 W  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    3   15002 -> 15002 S  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    4   13004 -> 13004 E  --    N0 S0 W0 E0   N,S,W,E
 * 
 * count_moved_elfs 2
 * 
 *      012345          012345
 *   0  ...#..       0  ....#.
 *   1  ..#...       1  ......
 *   2  #.....       2  #.#...
 *   3  ....#.       3  ....#.
 *   4  ......       4  ......
 *   5  ..#...       5  ..#...
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 5
 * 
 * Elf Nr.    0   10004 -> 10004 E  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    1   12002 -> 12002 S  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    2   12000 -> 12000 W  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    3   15002 -> 15002 S  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    4   13004 -> 13004 E  --    N0 S0 W0 E0   S,W,E,N
 * 
 * count_moved_elfs 0
 * 
 *      012345          012345
 *   0  ....#.       0  ....#.
 *   1  ......       1  ......
 *   2  #.#...       2  #.#...
 *   3  ....#.       3  ....#.
 *   4  ......       4  ......
 *   5  ..#...       5  ..#...
 * 
 * Result Part 1 = 0
 * Result Part 2 = 0
 * 
 * Day 23 - End
 */
type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER     : string = "     ";

const MAP_CHAR_OPEN_SQUARE   : string = ".";
const MAP_CHAR_ELF           : string = "#";

type GridDirection = { rel_row: number; rel_col: number };

const NORTH      : GridDirection = { rel_row : -1, rel_col :  0 };
const SOUTH      : GridDirection = { rel_row :  1, rel_col :  0 };
const EAST       : GridDirection = { rel_row :  0, rel_col : -1 };
const WEST       : GridDirection = { rel_row :  0, rel_col :  1 };

const NORTH_WEST : GridDirection = { rel_row : -1, rel_col : -1 };
const NORTH_EAST : GridDirection = { rel_row : -1, rel_col :  1 };

const SOUTH_WEST : GridDirection = { rel_row :  1, rel_col : -1 };
const SOUTH_EAST : GridDirection = { rel_row :  1, rel_col :  1 };

const cycleOrders: string[][] = [
['N','S','W','E'], 
['S','W','E','N'], 
['W','E','N','S'], 
['E','N','S','W'], 
];

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


function combineStrings( pString1: string | undefined | null, pString2: string | undefined | null) : string 
{
    const lines1 = ( pString1 != null ? pString1.split(/\r?\n/) : [] );
    const lines2 = ( pString2 != null ? pString2.split(/\r?\n/) : [] );

    const max_lines = Math.max( lines1.length, lines2.length );

    let result : string[] = [];

    for ( let line_index = 0; line_index < max_lines; line_index++ ) 
    {
        const str_a = line_index < lines1.length ? lines1[ line_index ] : "";
        const str_b = line_index < lines2.length ? lines2[ line_index ] : "";

        result.push( str_a + STR_COMBINE_SPACER + str_b );
    }

    return result.join("\n");
}


function getDebugMap( pMapInput : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
    {
        str_result += Math.abs( cur_col ) % 10;
    }

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        str_result += "\n";
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pMapInput[ "R" + cur_row  + "C" + cur_col ] ?? MAP_CHAR_OPEN_SQUARE;
        }
    }

    return str_result;
}


function checkGrid( pMapInput : PropertieMap, pRow : number, pCol : number, pDirection : GridDirection ) : number
{
    /*
     * Generate the key with the relative positions from the GridDirection
     */
    let key : string = "R" + ( pRow + pDirection.rel_row ) + "C" + ( pCol  + pDirection.rel_col );

    /*
     * Check, if there is an elf at that key-position
     */
    return pMapInput[ key ] === MAP_CHAR_ELF ? 1 : 0;
}


function checkNorth( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, NORTH ) + checkGrid( pMapInput, pRow, pCol, NORTH_WEST ) + checkGrid( pMapInput, pRow, pCol, NORTH_EAST ); 
}


function checkSouth( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, SOUTH ) + checkGrid( pMapInput, pRow, pCol, SOUTH_WEST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_EAST ); 
}


function checkWest( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, WEST ) + checkGrid( pMapInput, pRow, pCol, NORTH_WEST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_WEST ); 
}


function checkEast( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, EAST ) + checkGrid( pMapInput, pRow, pCol, NORTH_EAST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_EAST ); 
}


class Elf 
{
    id : number;

    cur_row : number = 0;
    cur_col : number = 0;

    proposed_dir : string = "X";
    proposed_row : number = 0;
    proposed_col : number = 0;

    elf_count_north : number = 0;
    elf_count_south : number = 0;
    elf_count_west  : number = 0;
    elf_count_east  : number = 0;

    cycle_nr : number = 0;

    cycle_index : string = "----";

    constructor( pID : number, pRow : number, pCol : number )
    {
        this.cur_row = pRow;
        this.cur_col = pCol;

        this.id = pID;
    }

    public getID()
    {
        return this.id;
    }

    public getCurRow() : number
    {
        return this.cur_row;
    }

    public getCurCol() : number
    {
        return this.cur_col;
    }

    public getProposedRow() : number
    {
        return this.proposed_row;
    }

    public getProposedCol() : number
    {
        return this.proposed_col;
    }

    public doMove2( pGrid : PropertieMap,  pElfArray : Elf[] ) : number  
    {
        for ( const cur_elf of pElfArray ) 
        {
            if ( cur_elf.getID() !== this.id )
            {
                /*
                 * Check for equal proposed coordinates
                 */
                if ( cur_elf.getProposedCoords() === this.getProposedCoords() )
                {
                    /*
                     * The elf has not moved.
                     * 0 is returned.
                     */
                    return 0;
                }

            }
        }

        if ( this.getProposedCoords() === this.getCurCoords() )
        {
            return 0;
        }

        /*
         * If no other elf has the same proposed coordinates,
         * the elf can move to the new position.
         */

        pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = MAP_CHAR_OPEN_SQUARE;

        this.cur_col = this.proposed_col;

        this.cur_row = this.proposed_row;

        pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = MAP_CHAR_ELF;

        return 1;
    }

    public doMove1( pMapInput : PropertieMap, pGridHeight : number, pGridWidth : number ) : void 
    {
        /*
         * Count the number of elfes in the top, left, right and bottom row.
         */
        this.elf_count_north  = checkNorth( pMapInput, this.cur_row, this.cur_col );
        this.elf_count_south  = checkSouth( pMapInput, this.cur_row, this.cur_col );
        this.elf_count_west   = checkWest(  pMapInput, this.cur_row, this.cur_col );
        this.elf_count_east   = checkEast(  pMapInput, this.cur_row, this.cur_col );

        let elf_surrounding : number = this.elf_count_north + this.elf_count_south + this.elf_count_west + this.elf_count_east;

        /*
         * The initial proposed coordinates, are the current coordinates.
         */
        this.proposed_row = this.cur_row;
        this.proposed_col = this.cur_col;

        /*
         * If all adjacent positions are free (=no elf), then the current elf doesn't move.
         */
        if ( elf_surrounding !== 0 ) 
        {
            let can_move_north : boolean = this.proposed_row > 0;

            let can_move_south : boolean = this.proposed_row < ( pGridHeight - 1 );

            let can_move_west  : boolean = this.proposed_col > 0;

            let can_move_east  : boolean = this.proposed_col < ( pGridWidth - 1 );
           
            this.proposed_dir = "-";

            for ( const cycle_direction of cycleOrders[ this.cycle_nr ]! ) 
            {
                switch ( cycle_direction ) 
                {
                    case 'N':

                        if ( ( can_move_north ) && ( this.elf_count_north === 0 ) ) 
                        {
                            this.proposed_dir = 'N';
                            this.proposed_row--;
                        }

                        break;

                    case 'S':

                        if ( ( can_move_south ) && ( this.elf_count_south === 0 ) )
                        {
                            this.proposed_dir = 'S';
                            this.proposed_row++;
                        }

                        break;

                    case 'W':

                        if ( ( can_move_west  ) && ( this.elf_count_west === 0 ) ) 
                        {
                            this.proposed_dir = 'W';
                            this.proposed_col--;
                        }

                        break;

                    case 'E':

                        if ( ( can_move_east  ) && ( this.elf_count_east === 0 ) )
                        {
                            this.proposed_dir = 'E';
                            this.proposed_col++;
                        }
                }

                if ( this.proposed_dir !== '-' ) break; 
            }
        }

        /*
         * For debug purposes, get the current cycle orders
         */
        this.cycle_index = cycleOrders[ this.cycle_nr ]!.join( ',' );

        /*
         * Increase the cycle nr for the next move
         */
        this.cycle_nr++;

        /*
         * If the cycle nr is greater than 3, set it to 0.
         */
        if ( this.cycle_nr > 3 )
        {
            this.cycle_nr = 0;
        }
    }

    public getProposedCoords() : number
    {
        return 10_000 + ( this.proposed_row * 1000 ) + this.proposed_col;
    }

    public getCurCoords() : number
    {
        return 10_000 + ( this.cur_row * 1000 ) + this.cur_col;
    }

    public doesMove() : boolean 
    {
        return this.getProposedCoords() !== this.getCurCoords();
    }

    public toString() : string 
    {
        let move_knz : String = this.doesMove() ? "MOVE" : " -- ";

        return "Elf Nr. " + padL( this.id, 4 ) + "   " + this.getCurCoords() + " -> " + this.getProposedCoords() + " " + this.proposed_dir + " " + move_knz + "   N" + this.elf_count_north  + " S" + this.elf_count_south  + " W" + this.elf_count_west  + " E" + this.elf_count_east + "   " + this.cycle_index;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01   : number = 0;
    let result_part_02   : number = 0;

    let grid_input : PropertieMap = {};

    let grid_rows  : number = 0;
    let grid_cols  : number = pArray[0]!.length;

    let elf_array : Elf[] = [];

    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            let cur_char_input : string = cur_input_str[ cur_col1 ] ?? MAP_CHAR_OPEN_SQUARE;

            if ( cur_char_input === MAP_CHAR_ELF )
            {
                grid_input[ "R" + grid_rows + "C" + cur_col1 ] = MAP_CHAR_ELF;

                elf_array.push( new Elf( elf_array.length, grid_rows, cur_col1 ) );
            }
        }

        grid_rows++;
    }

    grid_cols++;

    let dbg_map_before = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

    wl( "Initial Map" );
    wl( dbg_map_before );

    let loop_nr : number = 0;
    let count_moved_elfs : number = 1;

    while ( ( loop_nr < 15_000 ) && ( count_moved_elfs > 0 ) )
    {
        wl( "" );
        wl( "--------------------------------------------------------------------------------" );
        wl( "Loop Nr. " + loop_nr );
        wl( "" );
        
        /*
         * Move Part 1
         * Calculate the proposed Coordinates
         */
        for ( const cur_elf of elf_array ) 
        {
            cur_elf.doMove1( grid_input, grid_rows, grid_cols );
        }

        for ( const cur_elf of elf_array ) 
        {
            wl( cur_elf.toString() );
        }

        /*
         * Move Part 2
         * Try to move the elfes to their new proposed coordinates
         */

        dbg_map_before = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

        count_moved_elfs = 0;

        for ( const cur_elf of elf_array ) 
        {
            count_moved_elfs += cur_elf.doMove2( grid_input, elf_array );
        }

        let dbg_map_after = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

        wl( "" );
        wl( "count_moved_elfs " + count_moved_elfs );
        wl( "" );
        wl( combineStrings( dbg_map_before, dbg_map_after ) );

        loop_nr++;
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    //const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day23_input.txt";
    const filePath: string = "c:/Daten/advent_of_code_2022__day23_input.txt";

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

    array_test.push( ".....");
    array_test.push( "..##.");
    array_test.push( "..#..");
    array_test.push( ".....");
    array_test.push( "..##.");
    array_test.push( ".....");

    return array_test;
}

wl( "" );
wl( "Day 23: Unstable Diffusion" );
wl( "" );

calcArray( getTestArray1(), true );
//checkReaddatei();

wl( "" )
wl( "Day 23 - End" );
