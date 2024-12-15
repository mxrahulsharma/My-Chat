"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmojiPicker } from "@/components/emoji-picker";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
}

const formSchema = z.object({
    content: z.string().min(1, "Message cannot be empty"),
});

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type,
}: ChatInputProps) => {
    const { onOpen } = useModal();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    // Sends the message
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });
            await axios.post(url, values);
            form.reset();
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    // Dynamically adjust textarea height
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    // Handle "Enter" to send and "Shift + Enter" for new lines
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, fieldOnChange: any, value: string) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                form.handleSubmit(onSubmit)();
            }
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 border-t bg-white dark:bg-gray-800">
            {/* Attachment Button */}
            <button
                type="button"
                onClick={() => onOpen("messageFile", { apiUrl, query })}
                className="h-10 w-10 flex items-center justify-center bg-transparent rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <Plus className="text-gray-500 dark:text-gray-400" />
            </button>

            {/* Emoji Picker */}
            <div>
                <EmojiPicker
                    onChange={(emoji: string) =>
                        form.setValue("content", `${form.getValues("content")} ${emoji}`)
                    }
                />
            </div>

            {/* Dynamic Textarea */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex items-center">
                <textarea
                    className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 p-3 resize-none overflow-hidden focus:outline-none text-gray-700 dark:text-white"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    disabled={isLoading}
                    {...form.register("content")}
                    onInput={handleInput}
                    onKeyDown={(e) =>
                        handleKeyDown(e, form.setValue, form.getValues("content"))
                    }
                    rows={1} // Initial height
                />
            </form>

            {/* Send Button */}
            <button
                type="submit"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isLoading}
                className="h-10 w-10 flex items-center justify-center bg-blue-500 rounded-full hover:bg-blue-600 focus:bg-blue-400 transition text-white"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 2 11 13"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 2 15 22 11 13 2 9 22 2Z"
                    />
                </svg>
            </button>
        </div>
    );
};
