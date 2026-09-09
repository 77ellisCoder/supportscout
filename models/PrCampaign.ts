/**
 * This file defines the types for PR campaigns, including their status and structure.
 *
 * The PrCampaign type represents a public relations campaign in the system, with properties such as id, name, subject, emailBody, status, createdAt, and recipientCount.
 *
 * The CreatePrCampaignInput type is used when creating a new PR campaign, requiring properties such as name, subject, emailBody, and contactIds.
 *
 * @typedef {Object} PrCampaignStatus
 * @property {"draft" | "sending" | "sent" | "partially_sent" | "failed"} - The status of the PR campaign.
 * 
 * @typedef {Object} PrCampaignRecipientStatus
 * @property {"pending" | "sending" | "sent" | "failed" | "skipped"}
 * 
 * @typedef {Object} PrCampaign
 * @property {number} id - The unique identifier for the PR campaign.
 * @property {string} name - The name of the PR campaign.
 * @property {string} subject - The subject line of the PR campaign email.
 * @property {string} emailBody - The body content of the PR campaign email.
 * @property {PrCampaignStatus} status - The current status of the PR campaign.
 * @property {string} createdAt - The timestamp when the PR campaign was created.
 * @property {number} recipientCount - The number of recipients for the PR campaign.
 *
 * @typedef {Object} CreatePrCampaignInput
 * @property {string} name - The name of the new PR campaign.
 * @property {string} subject - The subject line of the new PR campaign email.
 * @property {string} emailBody - The body content of the new PR campaign email.
 * @property {number[]} contactIds - An array of contact IDs to whom the PR campaign will be sent.
 * 
 * @typedef {Object} CampaignAttachment
 * @property {number} id - The unique identifier for the campaign attachment.
 * @property {string} attachmentFilename - The filename of the campaign attachment.
 * @property {string} attachmentPath - The file path of the campaign attachment.
 * 
 * @typedef {Object} PrCampaignListItem
 * @property {number} id - The unique identifier for the PR campaign list item.
 * @property {string} name - The name of the PR campaign list item.
 * @property {string} subject - The subject line of the PR campaign list item email.
 * @property {PrCampaignStatus} status - The current status of the PR campaign list item.
 * @property {number} recipientCount - The number of recipients for the PR campaign list item.
 * @property {string} createdAt - The timestamp when the PR campaign list item was created.
 * @property {string} updatedAt - The timestamp when the PR campaign list item was last updated.
 * @property {string | null} sentAt - The timestamp when the PR campaign list item was sent, or null if not sent yet.
 */
export type PrCampaignStatus =
    | "draft"
    | "sending"
    | "sent"
    | "partially_sent"
    | "failed";

export type PrCampaignRecipientStatus =
    | "pending"
    | "sending"
    | "sent"
    | "failed"
    | "skipped";

export type PrCampaignRecipient = {
    recipientId: number;
    contactId: number;

    outlet: string;
    contactName: string | null;
    email: string | null;

    status: PrCampaignRecipientStatus;
    sentAt: string | null;
    errorMessage: string | null;
};

export type PrCampaign = {
    id: number;
    name: string;
    subject: string;
    emailBody: string;

    attachmentFilename?: string | null;
    attachmentPath?: string | null;

    status: PrCampaignStatus;

    createdAt: string;
    updatedAt?: string;
    sentAt?: string | null;

    recipients?: PrCampaignRecipient[];

    recipientCount?: number;
};

export type CreatePrCampaignInput = {
    name: string;
    subject: string;
    emailBody: string;
    contactIds: number[];
};

export type CampaignAttachment = {
    id: number;
    attachmentFilename: string;
    attachmentPath: string;
};

export type PrCampaignListItem = {
    id: number;
    name: string;
    subject: string;
    status: PrCampaignStatus;

    attachmentFilename: string | null;

    recipientCount: number;

    createdAt: string;
    updatedAt: string;
    sentAt: string | null;
};