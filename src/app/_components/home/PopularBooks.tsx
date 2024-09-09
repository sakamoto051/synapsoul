import PopularBookBar from "./PopularBookBar";

export default function PopularBooks() {
  const popularBookList = [
    "日本の小説",
    "ミステリー・サスペンス",
    "SF・ホラー",
  ];

  return (
    <div className="mt-8 w-full">
      {popularBookList.map((genre) => (
        <PopularBookBar key={genre} genre={genre} />
      ))}
    </div>
  );
}
