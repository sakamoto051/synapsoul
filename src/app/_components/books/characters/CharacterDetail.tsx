// src/app/_components/books/characters/CharacterDetail.tsx
import type React from "react";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import type { Character } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface CharacterDetailProps {
  character: Character | null;
  bookId: number;
  onSave: () => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  bookId,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [personality, setPersonality] = useState("");
  const [background, setBackground] = useState("");
  const [relationships, setRelationships] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  const createCharacter = api.character.create.useMutation({
    onSuccess: () => {
      toast({ title: "キャラクターを作成しました" });
      onSave();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCharacter = api.character.update.useMutation({
    onSuccess: () => {
      toast({ title: "キャラクターを更新しました" });
      onSave();
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCharacter = api.character.delete.useMutation({
    onSuccess: () => {
      toast({ title: "キャラクターを削除しました" });
      onSave();
      resetForm();
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (character) {
      setName(character.name);
      setColor(character.color);
      setAge(character.age?.toString() ?? "");
      setGender(character.gender ?? "");
      setPersonality(character.personality ?? "");
      setBackground(character.background ?? "");
      setRelationships(character.relationships ?? "");
    } else {
      resetForm();
    }
  }, [character]);

  const resetForm = () => {
    setName("");
    setColor("#000000");
    setAge("");
    setGender("");
    setPersonality("");
    setBackground("");
    setRelationships("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const characterData = {
      name,
      color,
      age: age ? Number(age) : null,
      gender: gender || null,
      personality: personality || null,
      background: background || null,
      relationships: relationships || null,
      bookId,
    };

    if (character) {
      updateCharacter.mutate({ id: character.id, ...characterData });
    } else {
      createCharacter.mutate(characterData);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (character) {
      deleteCharacter.mutate({ id: character.id });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前"
          required
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
        />
        <div className="flex items-center space-x-2">
          <label htmlFor="color" className="text-gray-300">
            色:
          </label>
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 p-1 bg-gray-700 border-gray-600 rounded"
          />
        </div>
        <Input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="年齢"
          type="number"
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
        />
        <Input
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="性別"
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
        />
        <Textarea
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          placeholder="性格"
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
        />
        <Textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="背景"
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
        />
        <Textarea
          value={relationships}
          onChange={(e) => setRelationships(e.target.value)}
          placeholder="関係性"
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
        />
        <div className="flex justify-between">
          {character && (
            <Button
              type="button"
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              削除
            </Button>
          )}
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {character ? "更新" : "作成"}
          </Button>
        </div>
      </form>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>キャラクターを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。本当に「{character?.name}
              」を削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CharacterDetail;
