'use client'

import { Button } from "@payloadcms/ui";
import { useAllFormFields, useDocumentInfo } from '@payloadcms/ui'
import { getSummaryFromOpenAi } from "./server";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical";
import { DefaultNodeTypes } from "@payloadcms/richtext-lexical";

const GenerateSummaryButton = () => {
  const [, dispatchFields] = useAllFormFields();

  const doc = useDocumentInfo();

  let content = '';
  const rteContent: DefaultTypedEditorState = doc.initialData?.content;
  

  rteContent.root.children.forEach((child) => {
    const children: (SerializedLexicalNode | DefaultNodeTypes)[] | undefined = child.children;
    children?.forEach((childchild) => {
      if (childchild.type === 'text') {
        content += childchild.text;
      }
    })
    
  })

  return (
    <Button
      onClick={async () => {
        dispatchFields({
          type: 'REMOVE',
          path: 'summary',
        })

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