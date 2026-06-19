-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rol` ENUM('ADMIN', 'COORDINADOR', 'VOLUNTARIO') NOT NULL DEFAULT 'VOLUNTARIO',
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `tipo` ENUM('PERSONA', 'EMPRESA') NOT NULL DEFAULT 'PERSONA',
    `creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `cantidad` DOUBLE NOT NULL,
    `unidad` VARCHAR(191) NOT NULL,
    `origen` VARCHAR(191) NOT NULL,
    `estado` ENUM('PENDIENTE', 'RECIBIDA', 'DISPONIBLE', 'ASIGNADA', 'EN_TRANSITO', 'ENTREGADA') NOT NULL DEFAULT 'PENDIENTE',
    `ot` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `donanteId` INTEGER NULL,
    `usuarioId` INTEGER NULL,
    `necesidadId` INTEGER NULL,
    `centroAcopioId` INTEGER NULL,

    UNIQUE INDEX `Donacion_ot_key`(`ot`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Necesidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria` VARCHAR(191) NOT NULL,
    `prioridad` ENUM('CRITICA', 'ALTA', 'MEDIA', 'BAJA') NOT NULL DEFAULT 'MEDIA',
    `cantRequerida` DOUBLE NOT NULL,
    `cantCubierta` DOUBLE NOT NULL DEFAULT 0,
    `estado` ENUM('ACTIVA', 'CUBIERTA', 'CERRADA') NOT NULL DEFAULT 'ACTIVA',
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comunaId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asignacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` ENUM('ASIGNADA', 'EN_TRANSITO', 'ENTREGADA') NOT NULL DEFAULT 'ASIGNADA',
    `fechaAsignacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaEntrega` DATETIME(3) NULL,
    `donacionId` INTEGER NOT NULL,
    `necesidadId` INTEGER NOT NULL,
    `responsableId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CentroAcopio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `capacidad` DOUBLE NOT NULL,
    `ocupado` DOUBLE NOT NULL DEFAULT 0,
    `estado` ENUM('ACTIVO', 'SATURADO', 'CERRADO') NOT NULL DEFAULT 'ACTIVO',
    `comunaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Region_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comuna` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `regionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Donacion` ADD CONSTRAINT `Donacion_donanteId_fkey` FOREIGN KEY (`donanteId`) REFERENCES `Donante`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donacion` ADD CONSTRAINT `Donacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donacion` ADD CONSTRAINT `Donacion_necesidadId_fkey` FOREIGN KEY (`necesidadId`) REFERENCES `Necesidad`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donacion` ADD CONSTRAINT `Donacion_centroAcopioId_fkey` FOREIGN KEY (`centroAcopioId`) REFERENCES `CentroAcopio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Necesidad` ADD CONSTRAINT `Necesidad_comunaId_fkey` FOREIGN KEY (`comunaId`) REFERENCES `Comuna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Necesidad` ADD CONSTRAINT `Necesidad_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asignacion` ADD CONSTRAINT `Asignacion_donacionId_fkey` FOREIGN KEY (`donacionId`) REFERENCES `Donacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asignacion` ADD CONSTRAINT `Asignacion_necesidadId_fkey` FOREIGN KEY (`necesidadId`) REFERENCES `Necesidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asignacion` ADD CONSTRAINT `Asignacion_responsableId_fkey` FOREIGN KEY (`responsableId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CentroAcopio` ADD CONSTRAINT `CentroAcopio_comunaId_fkey` FOREIGN KEY (`comunaId`) REFERENCES `Comuna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comuna` ADD CONSTRAINT `Comuna_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
