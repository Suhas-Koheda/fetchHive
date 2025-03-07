import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// These types should match your API response structure
interface OrganicResult {
  title: string;
  link: string;
  snippet?: string;
}

interface AnswerBox {
  answer?: string;
  title?: string;
  link?: string;
}

// This represents the inner searchResults object
interface SearchResults {
  organic?: OrganicResult[];
  answerBox?: AnswerBox;
}

// This represents the full API response
export interface ApiSearchResponse {
  success: boolean;
  searchResults?: SearchResults;
  error?: string;
}

// Updated props interface to accept the full API response
export interface SearchResultProps {
  data: ApiSearchResponse;
}

const SearchResultCard = ({ result }: { result: OrganicResult }) => {
  return (
    <Card className="mb-4 border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700">
      <CardContent className="pt-4">
        <a
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-1 text-lg font-medium text-blue-400 hover:text-blue-300"
        >
          {result.title}
        </a>
        <p className="mt-1 line-clamp-1 text-sm text-zinc-400">{result.link}</p>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-300">
          {result.snippet}
        </p>
      </CardContent>
    </Card>
  );
};

const AnswerBoxCard = ({ answerBox }: { answerBox: AnswerBox }) => {
  return (
    <Card className="mb-6 border-zinc-700 bg-zinc-800">
      <CardContent className="pt-4">
        <h3 className="mb-2 text-sm text-zinc-300">{answerBox.title}</h3>
        <p className="text-2xl font-semibold text-white">{answerBox.answer}</p>
      </CardContent>
    </Card>
  );
};

export const SearchResults = ({ data }: SearchResultProps) => {
  // Show error message if there is one
  if (!data.success || data.error) {
    return (
      <div className="p-4 text-red-500">
        {data.error ?? "Search was unsuccessful"}
      </div>
    );
  }

  // If no search results, show a message
  if (
    !data.searchResults ||
    (!data.searchResults.organic && !data.searchResults.answerBox)
  ) {
    return <div className="p-4 text-zinc-400">No results found</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-4">
        {data.searchResults.answerBox && (
          <AnswerBoxCard answerBox={data.searchResults.answerBox} />
        )}
        <div className="space-y-4">
          {data.searchResults.organic?.map((result, index) => (
            <SearchResultCard key={index} result={result} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};
