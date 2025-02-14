'use client'

import React from "react";
import { Button } from "@payloadcms/ui";
import { useAllFormFields, useDocumentInfo } from '@payloadcms/ui'
import { getSummaryFromOpenAi } from "./server";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { useForm } from "@payloadcms/ui";

const GenerateSummaryButton = () => {
  const [, dispatchFields] = useAllFormFields();
  const { setModified } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const doc = useDocumentInfo();


  return (
    <Button
      disabled={isLoading}
      onClick={async () => {
        try {
          setIsLoading(true)

          dispatchFields({
            type: 'REMOVE',
            path: 'summary',
          })
  
          let content = '';
          const rteContent: DefaultTypedEditorState = doc.savedDocumentData?.content;
  
          rteContent.root.children.forEach((child) => {
            const children = child.children;
            children?.forEach((childchild: any) => {
              if (childchild.type === 'text') {
                content += childchild.text;
              }
            })
            
          })
  
          const summary = await getSummaryFromOpenAi(content);
  
          dispatchFields({
            type: 'UPDATE',
            path: 'summary',
            value: summary,
          })
  
          setModified(true);
          setIsLoading(false);
  
        } catch {
          setIsLoading(false)
        }
      }}
    >
      AI Summary
    </Button>
  )
}

export default GenerateSummaryButton