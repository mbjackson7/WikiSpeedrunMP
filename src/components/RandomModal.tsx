import React from "react";
import { ModalClose, ModalContent, ModalRoot, ModalTitle } from "./Modal";
import { Article } from "../GameStore";
import ArticlePreview from "./ArticlePreview/ArticlePreview";
import { useI18nContext } from "../i18n/i18n-react";

interface RandomModalProps {
  data: Article[] | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setArticle: (article: Article) => void;
}
export const RandomModal = (props: RandomModalProps) => {
  const { LL } = useI18nContext();
  return (
    <ModalRoot open={props.open} onOpenChange={props.setOpen}>
      <ModalContent>
        <ModalTitle className="m-0 border-b-[1px] border-b-secondary-border text-lg font-medium">
          {LL.CHOOSE_ARTICLE()}
        </ModalTitle>
        <div className="gap flex flex-col gap-3 pt-5">
          {props.data?.map((article) => (
            <div className="flex gap-3" key={article.pageid}>
              <ModalClose asChild>
                <button
                  type="button"
                  onClick={() => props.setArticle(article)}
                  className="flex-1 border-[1px] border-black px-2 py-3 text-left hover:border-primary-blue hover:text-primary-blue focus-visible:border-primary-blue focus-visible:text-primary-blue dark:border-secondary-border dark:hover:border-primary-blue"
                >
                  {article.title}
                </button>
              </ModalClose>
              <ArticlePreview pageid={article.pageid} />
            </div>
          ))}
        </div>
      </ModalContent>
    </ModalRoot>
  );
};
