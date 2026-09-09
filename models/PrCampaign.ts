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
 */
export type PrCampaignStatus =
    | "draft"
    | "sending"
    | "sent"
    | "partially_sent"
    | "failed";

export type PrCampaign = {
    id: number;
    name: string;
    subject: string;
    emailBody: string;
    status: PrCampaignStatus;
    createdAt: string;
    recipientCount: number;

    attachmentFilename?: string | null;
    attachmentPath?: string | null;
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