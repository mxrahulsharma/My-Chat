"use client";

import * as z from "zod";
import { useState } from "react";
import { EmojiPicker } from "@/components/emoji-picker";
import { UserAvatar } from "@/components/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";

interface Reaction {
  emoji: string;
  users: string[]; // Track users who added this reaction
}

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const { onOpen } = useModal();

  // Handle Reaction Add/Remove
  const handleReaction = (emoji: string) => {
    const existingReactionIndex = reactions.findIndex(r => r.emoji === emoji);

    if (existingReactionIndex !== -1) {
      // If reaction exists
      const updatedReactions = [...reactions];
      const userIndex = updatedReactions[existingReactionIndex].users.indexOf(currentMember.id);

      if (userIndex !== -1) {
        // Remove user's reaction if already exists
        updatedReactions[existingReactionIndex].users.splice(userIndex, 1);
        
        // Remove the entire reaction if no users left
        if (updatedReactions[existingReactionIndex].users.length === 0) {
          updatedReactions.splice(existingReactionIndex, 1);
        }
      } else {
        // Add current user to the reaction
        updatedReactions[existingReactionIndex].users.push(currentMember.id);
      }

      setReactions(updatedReactions);
    } else {
      // Add new reaction
      setReactions([
        ...reactions, 
        { emoji, users: [currentMember.id] }
      ]);
    }
  };

  // Function to format and render message content with line breaks
  const formatMessageContent = (content: string) => {
    return content.split("\n").map((str, index) => (
      <span key={index}>
        {str}
        <br />
      </span>
    ));
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full"> 
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer">
          <UserAvatar src={member.profile.imageUrl ?? undefined} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <p className="font-semibold text-sm">
              {member.profile.name}
            </p>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          
          {/* Display message with preserved line breaks */}
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {formatMessageContent(content)}
            {isUpdated && !deleted && (
              <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                (edited)
              </span>
            )}
          </p>

          {/* Emoji Reactions Section */}
          <div className="mt-2 flex items-center space-x-2">
            {/* Display grouped reactions */}
            {reactions.map((reaction, index) => (
              <div 
                key={index} 
                className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-sm cursor-pointer hover:bg-gray-200"
                onClick={() => handleReaction(reaction.emoji)}
              >
                <span className="mr-1 text-lg">{reaction.emoji}</span>
                <span className="text-xs text-gray-600">{reaction.users.length}</span>
              </div>
            ))}

            {/* Emoji Picker appears on hover */}
            <div className="group-hover:block hidden">
              <EmojiPicker
                onChange={(emoji: string) => handleReaction(emoji)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;