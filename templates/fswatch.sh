#!/bin/bash

function fswatch_propagate_pwd_changes_to_docker () {
    mountDir="/code"
    localDir=$PWD

    echo "Starting fswatch on $PWD"
    # tracking previous not to get into endless loop of changing the same file
    local previous=''
    local previousTimestamp=$( date +%s )

    fswatch -r "$PWD" | while read file; do
        diff=$(( $( date +%s ) - $previousTimestamp ))

#        echo "diff = $diff"
        if [[ $file =~ .*_jb_.* ]]
        then
           echo "ignore $file"
        elif [[ "$previous" != "$file" || "$diff" -gt "1" ]]; then
            # 40 is pwd length
#            echo "---prev -$previous- $previousTimestamp $( date +%s )"
            docker exec rjanko_node_1 touch "$mountDir/${file:40}"
            previous="$file"
            previousTimestamp=$( date +%s )
            echo "Will touch $mountDir/${file:40} $previous"
        fi
    done
}

fswatch_propagate_pwd_changes_to_docker
