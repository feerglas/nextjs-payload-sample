'use client'

import { Button } from "@payloadcms/ui";
import { useAllFormFields, useDocumentInfo } from '@payloadcms/ui'
import { getSummaryFromOpenAi } from "./server";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

const GenerateSummaryButton = () => {
  const [, dispatchFields] = useAllFormFields();

  const doc = useDocumentInfo();


  return (
    <Button
      onClick={async () => {
        dispatchFields({
          type: 'REMOVE',
          path: 'summary',
        })

        let content = '';
        const rteContent: DefaultTypedEditorState = doc.savedDocumentData?.content;
        
        console.log(doc);

        rteContent.root.children.forEach((child) => {
          const children = child.children;
          children?.forEach((childchild: any) => {
            if (childchild.type === 'text') {
              content += childchild.text;
            }
          })
          
        })

        console.log(content);

        const summary = await getSummaryFromOpenAi(content);

        dispatchFields({
          type: 'UPDATE',
          path: 'summary',
          value: summary,
        })

      }}
    >
      AI Summary
    </Button>
  )
}

export default GenerateSummaryButton