"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef, useCallback, useRef } from "react";
import useResizeObserver from "use-resize-observer";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Tree,
  Folder,
  File,
  CollapseButton,
  TreeViewElement,
} from "./tree-view-api";
 

// TODO: Add the ability to add custom icons

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type TreeViewProps = {
  initialSelectedId?: string;
  elements: TreeViewElement[];
  indicator?: boolean;
  showcollapse?:boolean;
} & (
  | {
      initialExpendedItems?: string[];
      expandAll?: false;
    }
  | {
      initialExpendedItems?: undefined;
      expandAll: true;
    }
) &
  TreeViewComponentProps;

/**
 * Tree View Docs: {@link: https://shadcn-extension.vercel.app/docs/tree-view}
 */

export const TreeView = ({
  elements,
  className,
  initialSelectedId,
  initialExpendedItems,
  expandAll,
  indicator = false,
  showcollapse = false,
}: TreeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: elements.length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(() => 40, []),
    overscan: 5,
  });

  const { height = getTotalSize(), width } = useResizeObserver({
    ref: containerRef as React.RefObject<Element>,
  });
  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full rounded-md overflow-hidden py-1 relative",
        className,
      )}
    >
      <Tree
        initialSelectedId={initialSelectedId}
        initialExpendedItems={initialExpendedItems}
        elements={elements}
        style={{ height, width }}
        className="w-full h-full overflow-y-auto"
      >
        {getVirtualItems().map((element) => (
          <TreeItem
            aria-label="Root"
            key={element.key}
            elements={[elements[element.index]]}
            indicator={indicator}
          />
        ))}
        {showcollapse && (
        <CollapseButton elements={elements} expandAll={expandAll}>
          <span>Expand All</span>
        </CollapseButton>
        )
      }
      </Tree>
    </div>
  );
};

TreeView.displayName = "TreeView";

export const TreeItem = forwardRef<
  HTMLUListElement,
  {
    elements?: TreeViewElement[];
    indicator?: boolean;
  } & React.HTMLAttributes<HTMLUListElement>
>(({ elements, indicator, ...props }, ref) => {
  return (
    <ul ref={ref} className="w-full space-y-1 " {...props}>
      {elements &&
        elements.map((element) => (
          <li key={element.id} className="w-full pl-4 items-start">
          
            {element.children && element.children?.length > 0 ? (
              <Folder
                element={element.name}
                value={element.id}
                isSelectable={element.isSelectable}
              >
               
                <TreeItem
                  key={element.id}
                  aria-label={`folder ${element.name}`}
                  elements={element.children}
                  indicator={indicator}
                />
               
              </Folder>
            ) : (
              
              <File
              className="hover:bg-green-200"
                value={element.id}
                aria-label={`File ${element.name}`}
                key={element.id}
                isSelectable={element.isSelectable}
              >
                <span>{element?.name}</span>
              </File>
            
            )}
          
          </li>
        ))}
    </ul>
  );
});

TreeItem.displayName = "TreeItem";
