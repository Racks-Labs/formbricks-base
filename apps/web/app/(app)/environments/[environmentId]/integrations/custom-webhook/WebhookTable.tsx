"use client";

import { Button } from "@formbricks/ui";
import { useState } from "react";
import { TWebhook } from "@formbricks/types/v1/webhooks";
import AddWebhookModal from "@/app/(app)/environments/[environmentId]/integrations/custom-webhook/AddWebhookModal";
import { TSurvey } from "@formbricks/types/v1/surveys";
import WebhookModal from "@/app/(app)/environments/[environmentId]/integrations/custom-webhook/WebhookDetailModal";
import { Webhook } from "lucide-react";

export default function WebhookTable({
  environmentId,
  webhooks,
  surveys,
  children: [TableHeading, webhookRows],
}: {
  environmentId: string;
  webhooks: TWebhook[];
  surveys: TSurvey[];
  children: [JSX.Element, JSX.Element[]];
}) {
  const [isWebhookDetailModalOpen, setWebhookDetailModalOpen] = useState(false);
  const [isAddWebhookModalOpen, setAddWebhookModalOpen] = useState(false);

  const [activeWebhook, setActiveWebhook] = useState<TWebhook>({
    environmentId,
    id: "",
    url: "",
    triggers: [],
    surveyIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleOpenWebhookDetailModalClick = (e, webhook: TWebhook) => {
    e.preventDefault();
    setActiveWebhook(webhook);
    setWebhookDetailModalOpen(true);
  };

  return (
    <>
      <div className="mb-6 text-right">
        <Button
          variant="darkCTA"
          onClick={() => {
            setAddWebhookModalOpen(true);
          }}>
          <Webhook className="mr-2 h-5 w-5 text-white" />
          Add Webhook
        </Button>
      </div>
      <div className="rounded-lg border border-slate-200">
        {TableHeading}
        <div className="grid-cols-7">
          {webhooks.map((webhook, index) => (
            <button
              onClick={(e) => {
                handleOpenWebhookDetailModalClick(e, webhook);
              }}
              className="w-full"
              key={webhook.id}>
              {webhookRows[index]}
            </button>
          ))}
        </div>
      </div>
      <WebhookModal
        environmentId={environmentId}
        open={isWebhookDetailModalOpen}
        setOpen={setWebhookDetailModalOpen}
        webhook={activeWebhook}
        surveys={surveys}
      />
      <AddWebhookModal
        environmentId={environmentId}
        surveys={surveys}
        open={isAddWebhookModalOpen}
        setOpen={setAddWebhookModalOpen}
      />
    </>
  );
}
