const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ActivityType, AttachmentBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel, Partials.Message]
});

const CONFIG = {
    adminRole: "1519051140833218751",
    logChannel: "1518876917527482398",
    color: 0x4B0082 // البنفسجي الغامق
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('RAWAF SA BOT', {
        type: ActivityType.Streaming,
        url: 'https://www.twitch.tv/rawaf'
    });
});

// التعامل مع أوامر الخريطة (الأزرار)
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'map_roles') {
        await interaction.reply({ content: `**السلام عليكم؛**

شرح بسيط للرتب، لللإستفسار تواصل مع الاداره

> رتب التفاعل

<@&1519046388430803065> 
**اللفل المطلوب : 5**
**استمتع بالسيرفر**

<@&1519046968469491752> 
**اللفل المطلوب : 10**
**الخواص: استخدام ايموجيز من خارج السيرفر واضافة رياكشنز**

<@&1519047263626727647> 
**اللفل المطلوب : 15**
**الخواص: تغيير اسمك بالسيرفر**

<@&1519047654116425758> 
**اللفل المطلوب : 25**
**الخواص: اختيار لونك الخاص <#1518870053192466503> **

<@&1519047973965795540> 
**اللفل المطلوب :35**
**الخواص : ارسال صور وفيديوهات بالشات العام**

<@&1519048167188861018> 
**اللفل المطلوب :60**
**الخواص : جميع ماسبق**

<@&1519048390187548722> 
**اللفل المطلوب : 80**
**الخواص : رتبه خاصه**`, ephemeral: true });
    }
    if (interaction.customId === 'map_premium') {
        await interaction.reply({ content: `الرتب المميزه

<@&1519048728755830785>  يوتيوبر<a:E4N_youtube:1011043043987702001> 
**قناتك لازم تكون فيها فوق الالف**

<@&1519048847559622769> تيكتوكر<:MT_TikTok:1471085067903172709> 
**حسابك لازم يكون فيه 10k+**

<a:emoji_2:1519149426940051546> <@&1519049800287518780> 
**فانزات رواف الي عندهم 1k+ **

<a:emoji_1:1519149136551608502> <@&1519049858047152279> 
**فانزات رواف الي عندهم 10k+**

<@&1519049752157749418> كخاوي
**الي عنده لبس "كخه" **

<@&1519049595244515418> رسام<a:emoji_4:1519150693858938930> 
**الي عندهم حس فني**`, ephemeral: true });
    }
    if (interaction.customId === 'map_rooms') {
        await interaction.reply({ content: `**اهلاً وسهلا بك في دليل السيرفر ، هنا سيتم شرح أبزر الاشياء الموجوده داخل السيرفر:**

> رومات السيرفر :

**الرومات العامه :**
<#1518860063496867871>  
### ترحيب لك عند دخولك
-
<#1518860483392704533> 
### هنا يظهر تقدمك بالسيرفر وكم اجتزت لفل
-
<#1518860676494397620> 
### بوستات السيرفر 

> شاتات السيرفر :

<#1518851646174662707> لمتابعة أحدث وأخر اخبار السيرفر
-
<#1518852029089579059> لإختيار الرتب واهتمامك بالسيرفر
-
<#1518850225991848016> لفتح تذكرة دعم للإدارة والأقسام 
-
<#1518847251731185825> الشات العام للتحدث مع الأعضاء دون مخالفة القوانين
-
<#1518854040660869301> لمشاركة فنكم وابداعاتكم بالرسم
-
<#1518855027731599477> 
اقتراحاتكم لفيديوهات رواف الجايه
-
<#1518870053192466503> تغير لونك بالسيرفر

> أقسام السيرفر :

**قسم الفعاليات :**
<#1518853454443839619> شات الفعاليات عند اقامة فعاليه سيتم فتح الشات ويمكنك المشاركه 
<#1518853717825425579>  الفايزين مع رواف يقدرون يكتبون بالروم هذا

**قسم الالعاب :**
<#1518852185142591518> 

**قسم التصاميم :**
<#1518859276683182142> تصاميمكم لرواف
<#1518856037707546657> رسماتكم لرواف

**قسم الفانزات :**
<#1518871220706082867>  شات فانزات رواف الالماسيين
-
<#1518849706631893032> شات الكخاويين
-
<#1518849203722391754> يوزراتكم بروبلوكس

**قسم التريدات :**
<#1518857546822320131>  قوانين التريدات
<#1518858420097126462> تريدات ام ام تو
<#1518857897289842720> تريدات ادوبت مي
<#1518858567896010913> بلوكس فروت 
<#1518858829759250433> بيت سلمنيتر`, ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'خريطة') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('map_roles').setLabel('شرح رتب التفاعل').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('map_premium').setLabel('الرتب المميزه').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('map_rooms').setLabel('شرح الرومات').setStyle(ButtonStyle.Secondary)
        );
        const embed = new EmbedBuilder()
            .setTitle("مرحباً بك في سيرفر رواف")
            .setDescription("هنا تجد دليلك لكل شيء")
            .setColor(CONFIG.color)
            .setThumbnail("attachment://IMG_7025.jpeg")
            .setImage("attachment://IMG_5240.jpeg");
        
        await message.channel.send({ embeds: [embed], components: [row], files: ['./IMG_5240.jpeg', './IMG_7025.jpeg'] });
    }
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, AttachmentBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel, Partials.Message]
});

const CONFIG = {
    adminRole: "1519051140833218751",
    logChannel: "1518876917527482398",
    color: 0x4B0082
};

const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel, Partials.Message]
});

const CONFIG = {
    adminRole: "1519051140833218751",
    logChannel: "1518876917527482398",
    color: 0x4B0082
};

client.on('messageCreate', async message => {
    if (message.content === '!تكت') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('t_support').setLabel('تواصل مع الإدارة').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('t_complaint').setLabel('شكوى').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('t_rank').setLabel('طلب رتبة').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('t_creator').setLabel('صناع المحتوى').setStyle(ButtonStyle.Secondary)
        );

        const embed = new EmbedBuilder()
            .setTitle("نظام تذاكر سيرفر رواف")
            .setDescription("تنويه: استخدام التكت للطقطقة والسوالف سيعرضك للعقوبة والحرمان من استعمال النظام بشكل كامل.\n\nاختر القسم المناسب لفتح تذكرة.")
            .setColor(CONFIG.color);

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && ['t_support', 't_complaint'].includes(interaction.customId)) {
        const modal = new ModalBuilder().setCustomId('modal_data').setTitle('تفاصيل التذكرة');
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('reason').setLabel('سبب فتح التكت؟').setStyle(TextInputStyle.Paragraph).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('desc').setLabel('وصف الحالة').setStyle(TextInputStyle.Paragraph).setRequired(true))
        );
        return await interaction.showModal(modal);
    }

    if (interaction.isButton() && ['t_rank', 't_creator'].includes(interaction.customId)) {
        let reason = interaction.customId === 't_rank' ? 'طلب رتبة' : 'صناع محتوى';
        await createTicket(interaction, reason, "لا يوجد استبيان");
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_data') {
        await createTicket(interaction, interaction.fields.getTextInputValue('reason'), interaction.fields.getTextInputValue('desc'));
    }

    if (interaction.isButton() && interaction.customId === 'btn_close') {
        const modal = new ModalBuilder().setCustomId('modal_close').setTitle('سبب الغلق');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('c_reason').setLabel('سبب الغلق؟').setStyle(TextInputStyle.Paragraph).setRequired(true)));
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_close') {
        const reason = interaction.fields.getTextInputValue('c_reason');
        await interaction.reply(`تم غلق التكت. السبب: ${reason}`);
        interaction.channel.delete().catch(() => {});
    }

    if (interaction.isButton() && interaction.customId === 'btn_delete') {
        const logChannel = interaction.guild.channels.cache.get(CONFIG.logChannel);
        if (logChannel) {
            const msgs = await interaction.channel.messages.fetch({ limit: 100 });
            const transcript = msgs.map(m => `${m.author.tag}: ${m.content}`).reverse().join('\n');
            await logChannel.send({ content: `**أرشفة تكت:**\n\`\`\`${transcript.slice(0, 1900)}\`\`\`` });
        }
        await interaction.channel.delete();
    }
});

async function createTicket(interaction, reason, desc) {
    const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            { id: interaction.guild.id, deny: ['ViewChannel'] },
            { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] },
            { id: CONFIG.adminRole, allow: ['ViewChannel', 'SendMessages'] }
        ]
    });

    const embed = new EmbedBuilder()
        .setTitle("تذكرة جديدة")
        .setDescription(`**صاحب التكت:** ${interaction.user}\n**السبب:** ${reason}\n**الوصف:** ${desc}`)
        .setColor(CONFIG.color);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('btn_close').setLabel('غلق').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('btn_delete').setLabel('حذف').setStyle(ButtonStyle.Danger)
    );

    await channel.send({ content: `<@&${CONFIG.adminRole}>`, embeds: [embed], components: [row] });
    await interaction.reply({ content: `تم فتح تذكرتك: ${channel}`, ephemeral: true });
}

client.login(process.env.TOKEN);
