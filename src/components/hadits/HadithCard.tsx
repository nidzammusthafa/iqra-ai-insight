import { Hadith } from "@/types/hadits";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HadithCardProps {
  hadith: Hadith;
  rawiName: string;
}

export const HadithCard = ({ hadith, rawiName }: HadithCardProps) => {
  return (
    <Card className="mb-4 verse-card">
      <CardHeader>
        <CardTitle>
          Hadits {rawiName} No. {hadith.number}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="arabic-text text-2xl leading-loose text-right">
          {hadith.arab}
        </p>
        <p className="text-muted-foreground leading-relaxed text-justify">
          {hadith.id}
        </p>
      </CardContent>
    </Card>
  );
};
